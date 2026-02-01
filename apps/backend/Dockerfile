# ----------------------------------------------------
# STAGE 1: Build & Publish
# ----------------------------------------------------
FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build

WORKDIR /src

COPY Framely.API/Framely.API.csproj Framely.API/
COPY Framely.Core/Framely.Core.csproj Framely.Core/
COPY Framely.Infrastructure/Framely.Infrastructure.csproj Framely.Infrastructure/

RUN dotnet restore Framely.API/Framely.API.csproj

COPY . .

WORKDIR /src/Framely.API
RUN dotnet publish \
    -c Release \
    --no-restore \
    -o /app/publish


# ----------------------------------------------------
# STAGE 2: Runtime (AKS SAFE FOR .NET 9)
# ----------------------------------------------------
FROM mcr.microsoft.com/dotnet/aspnet:9.0

ENV ASPNETCORE_ENVIRONMENT=Production
ENV ASPNETCORE_URLS=http://+:8080

# CRITICAL for .NET 9 stability
ENV DOTNET_EnableDiagnostics=0
ENV DOTNET_SYSTEM_GLOBALIZATION_INVARIANT=false

# Install required native libs (ICU + tzdata)
RUN apt-get update && \
    apt-get install -y --no-install-recommends \
        libicu-dev \
        tzdata \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copy published output
COPY --from=build /app/publish .

# Use numeric non-root user (NO adduser/addgroup)
USER 10001

EXPOSE 8080

ENTRYPOINT ["dotnet", "Framely.API.dll"]
