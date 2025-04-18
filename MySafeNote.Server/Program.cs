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

                // ��������� AuthOptions
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
                builder.Services.AddDbContext<DataContext>(options => options.UseNpgsql(connection));

                // ����������� ������������
                builder.Services.AddScoped<IUserRepository, UserRepository>();
                builder.Services.AddScoped<INoteRepository, NoteRepository>();
                builder.Services.AddScoped<INotebookRepository, NotebookRepository>();

                // ����������� ��������
                builder.Services.AddScoped<INoteService, NoteService>();
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

