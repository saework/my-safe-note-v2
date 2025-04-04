using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.EntityFrameworkCore;
using MySafeNote.DataAccess;
using MySafeNote.DataAccess.Repositories;
using MySafeNote.Core.Abstractions;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authentication.OAuth;
using Microsoft.IdentityModel.Tokens;
using MySafeNote.Server.Auth;
using MySafeNote.Server.Services;
using DocumentFormat.OpenXml.Office2016.Drawing.ChartDrawing;
using Microsoft.AspNetCore.Http;
using MySafeNote.Server.Middlewares;
using MySafeNote.Server.Configs;
using Serilog;

namespace MySafeNote
{
    public class Program
    {
        public static void Main(string[] args)
        {
            // Настройка логирования
            //LoggingConfiguration.ConfigureLogging();

            //Log.Logger = new LoggerConfiguration()
            //    .ReadFrom.Configuration(new ConfigurationBuilder()
            //        .SetBasePath(Directory.GetCurrentDirectory())
            //        .AddJsonFile("appsettings.json", optional: false, reloadOnChange: true)
            //        .Build())
            //    .CreateLogger();

            //Log.Information("Start MySafeNote Server");

            try
            {
                var builder = WebApplication.CreateBuilder(args);

                Log.Logger = new LoggerConfiguration()
                    .ReadFrom.Configuration(builder.Configuration)
                    .CreateLogger();

                Log.Information("Start MySafeNote Server");

                builder.Host.UseSerilog();

                builder.Services.AddAuthorization();
                builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
                    .AddJwtBearer(options =>
                    {
                        options.TokenValidationParameters = new TokenValidationParameters
                        {
                            // указывает, будет ли валидироваться издатель при валидации токена
                            ValidateIssuer = true,
                            // строка, представляющая издателя
                            ValidIssuer = AuthOptions.ISSUER,
                            // будет ли валидироваться потребитель токена
                            ValidateAudience = true,
                            // установка потребителя токена
                            ValidAudience = AuthOptions.AUDIENCE,
                            // будет ли валидироваться время существования
                            ValidateLifetime = true,
                            // установка ключа безопасности
                            IssuerSigningKey = AuthOptions.GetSymmetricSecurityKey(),
                            // валидация ключа безопасности
                            ValidateIssuerSigningKey = true,
                        };
                    });

                // Настройка служб
                builder.Services.AddControllers();
                builder.Services.AddSwaggerGen();

                // Настройка контекста базы данных
                var connection = builder.Configuration.GetConnectionString("Default");

                // TODO поменять на postgee перед запуском в prod !!!
                builder.Services.AddDbContext<DataContext>(options => options.UseSqlite(connection));

                // Регистрация репозиториев
                builder.Services.AddScoped<IUserRepository, UserRepository>();
                builder.Services.AddScoped<INoteRepository, NoteRepository>();
                builder.Services.AddScoped<INotebookRepository, NotebookRepository>();

                // Регистрация сервисов
                builder.Services.AddScoped<INoteService, NoteService>();
                builder.Services.AddScoped<INotebookService, NotebookService>();
                builder.Services.AddScoped<IUserService, UserService>();

                var app = builder.Build();

                // Middleware для обработки ошибок
                app.UseMiddleware<ErrorHandlingMiddleware>();

                app.UseAuthentication();
                app.UseAuthorization();

                // Инициализация базы данных
                using (var scope = app.Services.CreateScope())
                {
                    var dbContext = scope.ServiceProvider.GetRequiredService<DataContext>();
                    DbInitializer.Initialize(dbContext);
                }

                app.UseDefaultFiles();
                app.UseStaticFiles();

                // Configure the HTTP request pipeline.
                if (app.Environment.IsDevelopment())
                {
                    app.UseSwagger();
                    app.UseSwaggerUI();
                }

                app.UseHttpsRedirection();

                //pp.UseAuthorization();
                app.MapControllers(); // Настройка маршрутов контроллеров

                app.MapFallbackToFile("/index.html");

                app.Run(); // Запуск приложения
            }
            catch (Exception ex)
            {
                Log.Fatal(ex, "Application start-up failed");
            }
            finally
            {
                Log.Information("Stop MySafeNote Server.");
                Log.CloseAndFlush();
            }
        }
    }
}

