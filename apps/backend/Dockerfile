# ================================
# STAGE 1: Build & Publish
# ================================
FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build

WORKDIR /src

# Copy csproj files
COPY Framely.API/Framely.API.csproj ./Framely.API/
COPY Framely.Core/Framely.Core.csproj ./Framely.Core/
COPY Framely.Infrastructure/Framely.Infrastructure.csproj ./Framely.Infrastructure/

# Restore dependencies (Release-safe)
RUN dotnet restore ./Framely.API/Framely.API.csproj

# Copy source
COPY . .

# Publish (ALLOW restore)
WORKDIR /src/Framely.API
RUN dotnet publish \
    --configuration Release \
    --output /app/publish

# ================================
# STAGE 2: Runtime
# ================================
FROM mcr.microsoft.com/dotnet/aspnet:9.0 AS runtime

WORKDIR /app

ENV ASPNETCORE_ENVIRONMENT=Production
ENV ASPNETCORE_URLS=http://+:8080

EXPOSE 8080

COPY --from=build /app/publish .

ENTRYPOINT ["dotnet", "Framely.API.dll"]
