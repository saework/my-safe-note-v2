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

namespace MySafeNote
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);

            builder.Services.AddAuthorization();
            builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
                .AddJwtBearer(options =>
                {
                    options.TokenValidationParameters = new TokenValidationParameters
                    {
                        // указывает, будет ли валидироватьс€ издатель при валидации токена
                        ValidateIssuer = true,
                        // строка, представл€юща€ издател€
                        ValidIssuer = AuthOptions.ISSUER,
                        // будет ли валидироватьс€ потребитель токена
                        ValidateAudience = true,
                        // установка потребител€ токена
                        ValidAudience = AuthOptions.AUDIENCE,
                        // будет ли валидироватьс€ врем€ существовани€
                        ValidateLifetime = true,
                        // установка ключа безопасности
                        IssuerSigningKey = AuthOptions.GetSymmetricSecurityKey(),
                        // валидаци€ ключа безопасности
                        ValidateIssuerSigningKey = true,
                    };
                });

            // Ќастройка служб
            builder.Services.AddControllers();
            builder.Services.AddSwaggerGen();

            // Ќастройка контекста базы данных
            var connection = builder.Configuration.GetConnectionString("Default");

            // TODO помен€ть на postgee перед запуском в prod !!!
            builder.Services.AddDbContext<DataContext>(options => options.UseSqlite(connection));

            // –егистраци€ репозиториев
            builder.Services.AddScoped<IUserRepository, UserRepository>();
            builder.Services.AddScoped<INoteRepository, NoteRepository>();
            builder.Services.AddScoped<INotebookRepository, NotebookRepository>();

            // –егистраци€ сервисов
            builder.Services.AddScoped<INotebookService, NotebookService>();
            builder.Services.AddScoped<IUserService, UserService>();

            var app = builder.Build();

            app.UseAuthentication();
            app.UseAuthorization();

            // »нициализаци€ базы данных
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
            app.MapControllers(); // Ќастройка маршрутов контроллеров

            app.MapFallbackToFile("/index.html");

            app.Run(); // «апуск приложени€
        }
    }
}

