using Microsoft.EntityFrameworkCore;
using MySafeNote.DataAccess;
using MySafeNote.DataAccess.Repositories;
using MySafeNote.Core.Abstractions;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using MySafeNote.Server.Auth;
using MySafeNote.Server.Services;
using Serilog;

namespace MySafeNote
{
    public class Program
    {
        public static void Main(string[] args)
        {
            try
            {
                var builder = WebApplication.CreateBuilder(args);

                // Настройка AuthOptions
                AuthOptions.Configure(builder.Configuration);

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
                            // Указывает, будет ли валидироваться издатель при валидации токена
                            ValidateIssuer = true,
                            // Строка, представляющая издателя
                            ValidIssuer = AuthOptions.ISSUER,
                            // Будет ли валидироваться потребитель токена
                            ValidateAudience = true,
                            // Установка потребителя токена
                            ValidAudience = AuthOptions.AUDIENCE,
                            // Будет ли валидироваться время существования
                            ValidateLifetime = true,
                            // Установка ключа безопасности
                            IssuerSigningKey = AuthOptions.GetSymmetricSecurityKey(),
                            // Валидация ключа безопасности
                            ValidateIssuerSigningKey = true,
                        };
                    });

                // Настройка служб
                builder.Services.AddControllers();
                builder.Services.AddSwaggerGen();

                // Настройка контекста базы данных
                var connection = builder.Configuration.GetConnectionString("Default");
                builder.Services.AddDbContext<DataContext>(options =>
                    options.UseNpgsql(connection, npgsqlOptions =>
                        npgsqlOptions.EnableRetryOnFailure(
                            maxRetryCount: 5,
                            maxRetryDelay: TimeSpan.FromSeconds(10),
                            errorCodesToAdd: null
                        )
                    )
                );

                // Регистрация репозиториев
                builder.Services.AddScoped<IUserRepository, UserRepository>();
                builder.Services.AddScoped<INoteRepository, NoteRepository>();
                builder.Services.AddScoped<INotebookRepository, NotebookRepository>();

                // Регистрация сервисов
                builder.Services.AddScoped<INoteService, NoteService>();
                builder.Services.AddScoped<INotebookService, NotebookService>();
                builder.Services.AddScoped<IUserService, UserService>();

                var app = builder.Build();

                app.UseAuthentication();
                app.UseAuthorization();

                // Применение миграций и инициализация БД
                using (var scope = app.Services.CreateScope())
                {
                    var services = scope.ServiceProvider;
                    try
                    {
                        var context = services.GetRequiredService<DataContext>();

                        // Проверяем наличие pending-миграций
                        var pendingMigrations = context.Database.GetPendingMigrations();
                        if (pendingMigrations.Any())
                        {
                            Log.Information("Applying migrations: {Migrations}", string.Join(", ", pendingMigrations));
                            context.Database.Migrate();
                        }

                        // Инициализация тестовых данных
                        DbInitializer.Initialize(context);
                        Log.Information("The database has been initialized successfully");
                    }
                    catch (Exception ex)
                    {
                        Log.Fatal(ex, "Error migration or initialization of the database");
                        throw; // Прерываем запуск приложения при критической ошибке
                    }
                }

                app.UseDefaultFiles();
                app.UseStaticFiles();

                if (app.Environment.IsDevelopment())
                {
                    app.UseSwagger();
                    app.UseSwaggerUI();
                }
                app.UseHttpsRedirection();

                app.MapControllers();

                app.MapFallbackToFile("/index.html");

                app.Run();
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

