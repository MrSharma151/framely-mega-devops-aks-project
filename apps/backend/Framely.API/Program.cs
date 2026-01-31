using AutoMapper;
using Framely.API.Mappings;
using Framely.API.Swagger;
using Framely.Core.Interfaces;
using Framely.Core.Models;
using Framely.Infrastructure.Data;
using Framely.Infrastructure.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using System.Text;
using static System.Runtime.InteropServices.JavaScript.JSType;

var builder = WebApplication.CreateBuilder(args);

// Reads secrets from /mnt/secrets/<key> and injects into IConfiguration
builder.Configuration.AddKeyPerFile("/mnt/secrets", optional: true);

// Step 1: Add Controllers
builder.Services.AddControllers();

// Step 2: Add Swagger with JWT and file upload support
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.OperationFilter<FileUploadOperationFilter>();

    c.SwaggerDoc("v1", new OpenApiInfo
    {
        Title = "Framely API",
        Version = "1",
        Description = "Framely Optical Web App API"
    });

    c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Name = "Authorization",
        Type = SecuritySchemeType.ApiKey,
        Scheme = "Bearer",
        BearerFormat = "JWT",
        In = ParameterLocation.Header,
        Description = "Enter ‘Bearer’ followed by a space and your token."
    });

    c.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference
                {
                    Type = ReferenceType.SecurityScheme,
                    Id = "Bearer"
                }
            },
            Array.Empty<string>()
        }
    });
});


// Step 3: Register DbContext
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseSqlServer(
        builder.Configuration.GetConnectionString("DefaultConnection"),
        sqlOptions => sqlOptions.EnableRetryOnFailure()
    ));

// Step 4: Configure Identity
builder.Services.AddIdentity<AppUser, IdentityRole>()
    .AddEntityFrameworkStores<ApplicationDbContext>()
    .AddDefaultTokenProviders();

builder.Services.Configure<IdentityOptions>(options =>
{
    options.Password.RequireDigit = true;
    options.Password.RequiredLength = 8;
    options.Password.RequireUppercase = true;
    options.Password.RequireLowercase = true;
    options.Password.RequireNonAlphanumeric = false;
});

// Step 5: Configure JWT Authentication
var jwtSection = builder.Configuration.GetSection("JwtSettings");
var jwtKey = jwtSection["Secret"] ?? throw new Exception("JWT Key is missing in configuration");
var jwtIssuer = jwtSection["Issuer"] ?? throw new Exception("JWT Issuer is missing in configuration");
var jwtAudience = jwtSection["Audience"] ?? "FramelyUsers";

builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = true,
        ValidateAudience = true,
        ValidateLifetime = true,
        ValidateIssuerSigningKey = true,
        ValidIssuer = jwtIssuer,
        ValidAudience = jwtAudience,
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey)),
        ClockSkew = TimeSpan.Zero
    };
});

// Step 6: Register Application Services
builder.Services.AddScoped<IAuthService, AuthService>();
builder.Services.AddScoped<IBlobService, BlobService>();

// Step 7: Register AutoMapper
builder.Services.AddAutoMapper(cfg => cfg.AddProfile<AutoMapperProfile>());

// Step 8: Add CORS for frontend (supports multiple origins)
var frontendOrigins = builder.Configuration
    .GetSection("FrontendOrigins")
    .Get<string[]>();

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy
            .WithOrigins(frontendOrigins ?? new[]
            {
                "http://localhost:3000",
                "http://localhost:3001"
            })
            .AllowAnyHeader()
            .AllowAnyMethod();
    });
});

var app = builder.Build();

// Step 9: Enable Swagger UI in Dev or Staging
if (builder.Configuration.GetValue<bool>("Swagger:Enabled"))
{
    app.UseSwagger();
    app.UseSwaggerUI(c =>
    {
        c.SwaggerEndpoint("/swagger/v1/swagger.json", "Framely API v1");
    });
}

// Step 10: Middleware pipeline
// app.UseHttpsRedirection();
app.UseRouting();
app.UseCors("AllowFrontend");
app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();


// This is the entry point for the Framely API application.
app.MapGet("/", async context =>
{
    var html = @"
        <!DOCTYPE html>
        <html>
        <head>
            <title>Framely API</title>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    background: #0d1117;
                    color: #fff;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    height: 100vh;
                }
                .container {
                    text-align: center;
                }
                button {
                    padding: 12px 24px;
                    font-size: 16px;
                    border: none;
                    border-radius: 8px;
                    cursor: pointer;
                    background-color: #4676E1;
                    color: white;
                    transition: 0.3s;
                }
                button:hover {
                    background-color: #365dc1;
                }
            </style>
        </head>
        <body>
            <div class='container'>
                <h1>Framely API</h1>
                <p>Welcome to Framely backend service</p>
                <button onclick=""window.location.href='/swagger/index.html'"">
                    Open Swagger Docs
                </button>
            </div>
        </body>
        </html>";
context.Response.ContentType = "text/html";
await context.Response.WriteAsync(html);
});


// 🔥 CRITICAL: Ensure DB + Tables + Roles exist (Docker / Azure safe)
using (var scope = app.Services.CreateScope())
{
    var services = scope.ServiceProvider;

    try
    {
        var dbContext = services.GetRequiredService<ApplicationDbContext>();
        await dbContext.Database.MigrateAsync();

        var roleManager = services.GetRequiredService<RoleManager<IdentityRole>>();
        var userManager = services.GetRequiredService<UserManager<AppUser>>();

        // 1️⃣ Ensure roles
        string[] roles = { "USER", "ADMIN" };
        foreach (var role in roles)
        {
            if (!await roleManager.RoleExistsAsync(role))
            {
                await roleManager.CreateAsync(new IdentityRole(role));
            }
        }

        // 2️⃣ Seed DEFAULT ADMIN (ONLY ONCE)
        var adminEmail = "admin@framely.com";
        var adminPassword = "Admin@123"; // 👉 first-time only

        var adminUser = await userManager.FindByEmailAsync(adminEmail);
        if (adminUser == null)
        {
            adminUser = new AppUser
            {
                UserName = adminEmail,
                Email = adminEmail,
                FullName = "System Admin",
                EmailConfirmed = true
            };

            var result = await userManager.CreateAsync(adminUser, adminPassword);
            if (result.Succeeded)
            {
                await userManager.AddToRoleAsync(adminUser, "ADMIN");

                Console.WriteLine("✅ DEFAULT ADMIN CREATED, please update credentials from the default one!");
                Console.WriteLine($"📧 {adminEmail}");
                Console.WriteLine($"🔑 {adminPassword}");
            }
        }
    }
    catch (Exception ex)
    {
        Console.WriteLine("⚠️ DATABASE / SEED FAILED – will retry on next restart");
        Console.WriteLine(ex);
    }
}

// Step 11: Run the application
app.Run();