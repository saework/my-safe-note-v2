# Используйте официальный образ Node.js для сборки фронтенда
FROM node:18 AS frontend-build
WORKDIR /app

# Копируем package.json и package-lock.json
COPY mysafenote.client/package*.json ./

# Устанавливаем зависимости
RUN npm install

# Копируем все файлы фронтенда и собираем проект
COPY mysafenote.client/ ./
RUN npm run build

# Используйте официальный образ .NET SDK для сборки приложения
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
# Установка Node.js
RUN apt-get update && \
    apt-get install -y curl && \
    curl -fsSL https://deb.nodesource.com/setup_18.x | bash - && \
    apt-get install -y nodejs
WORKDIR /src

# Копируем файл проекта и восстанавливаем зависимости
COPY ["MySafeNote.Server/MySafeNote.Server.csproj", "MySafeNote.Server/"]
COPY ["MySafeNote.Core/MySafeNote.Core.csproj", "MySafeNote.Core/"]
COPY ["MySafeNote.DataAccess/MySafeNote.DataAccess.csproj", "MySafeNote.DataAccess/"]

# Восстанавливаем зависимости
RUN dotnet restore "MySafeNote.Server/MySafeNote.Server.csproj"

# Копируем все файлы и собираем проект
COPY . .
WORKDIR "/src/MySafeNote.Server"
RUN dotnet build "MySafeNote.Server.csproj" -c Release -o /app/build

# Публикуем приложение
FROM build AS publish
RUN dotnet publish "MySafeNote.Server.csproj" -c Release -o /app/publish

# Используем официальный образ .NET для запуска приложения
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS final
WORKDIR /app

# Копируем собранные статические файлы фронтенда
# COPY --from=frontend-build /app/build ./wwwroot
COPY --from=frontend-build /app/dist ./wwwroot

# Копируем опубликованные файлы бэкенда
COPY --from=publish /app/publish .

ENTRYPOINT ["dotnet", "MySafeNote.Server.dll"]