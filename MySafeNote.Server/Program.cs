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
                        // ���������, ����� �� �������������� �������� ��� ��������� ������
                        ValidateIssuer = true,
                        // ������, �������������� ��������
                        ValidIssuer = AuthOptions.ISSUER,
                        // ����� �� �������������� ����������� ������
                        ValidateAudience = true,
                        // ��������� ����������� ������
                        ValidAudience = AuthOptions.AUDIENCE,
                        // ����� �� �������������� ����� �������������
                        ValidateLifetime = true,
                        // ��������� ����� ������������
                        IssuerSigningKey = AuthOptions.GetSymmetricSecurityKey(),
                        // ��������� ����� ������������
                        ValidateIssuerSigningKey = true,
                    };
                });

            // ��������� �����
            builder.Services.AddControllers();
            builder.Services.AddSwaggerGen();

            // ��������� ��������� ���� ������
            var connection = builder.Configuration.GetConnectionString("Default");

            // TODO �������� �� postgee ����� �������� � prod !!!
            builder.Services.AddDbContext<DataContext>(options => options.UseSqlite(connection));

            // ����������� ������������
            builder.Services.AddScoped<IUserRepository, UserRepository>();
            builder.Services.AddScoped<INoteRepository, NoteRepository>();
            builder.Services.AddScoped<INotebookRepository, NotebookRepository>();

            // ����������� ��������
            builder.Services.AddScoped<INotebookService, NotebookService>();
            builder.Services.AddScoped<IUserService, UserService>();

            var app = builder.Build();

            app.UseAuthentication();
            app.UseAuthorization();

            // ������������� ���� ������
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
            app.MapControllers(); // ��������� ��������� ������������

            app.MapFallbackToFile("/index.html");

            app.Run(); // ������ ����������
        }
    }
}

