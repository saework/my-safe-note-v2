using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.EntityFrameworkCore;
using MySafeNote.DataAccess;
using MySafeNote.DataAccess.Repositories;
using MySafeNote.Core.Abstractions;

namespace MySafeNote
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);

            // ��������� �����
            builder.Services.AddControllers();
            builder.Services.AddSwaggerGen();

            // ��������� ��������� ���� ������
            var connection = builder.Configuration.GetConnectionString("Default");
            builder.Services.AddDbContext<DataContext>(options => options.UseSqlite(connection));

            // ����������� ������������
            builder.Services.AddScoped<IUserRepository, UserRepository>();
            builder.Services.AddScoped<INoteRepository, NoteRepository>();

            //// ��������� ����������� ������ ��� SPA
            //builder.Services.AddSpaStaticFiles(configuration =>
            //{
            //    configuration.RootPath = "ClientApp/build";
            //});

            var app = builder.Build();

            //// ��������� ��������� ��������� HTTP-��������
            //if (app.Environment.IsDevelopment())
            //{
            //    app.UseDeveloperExceptionPage();
            //}
            //else
            //{
            //    app.UseExceptionHandler("/Error");
            //    app.UseHsts();
            //}

            // ������������� ���� ������ (���� ��� ��������� � ����� �������)
            //DbInitializer.Initialize(app.Services.CreateScope().ServiceProvider.GetRequiredService<DataContext>());
            // ������������� ���� ������
            using (var scope = app.Services.CreateScope())
            {
                var dbContext = scope.ServiceProvider.GetRequiredService<DataContext>();
                DbInitializer.Initialize(dbContext);
            }

            //// ��������� Swagger
            //app.UseSwagger();
            //app.UseSwaggerUI(c =>
            //{
            //    c.SwaggerEndpoint("/swagger/v1/swagger.json", "v1");
            //});

            //app.UseHttpsRedirection();
            //app.UseStaticFiles();
            //app.UseSpaStaticFiles();

            //app.UseRouting();

            app.UseDefaultFiles();
            app.UseStaticFiles();

            // Configure the HTTP request pipeline.
            if (app.Environment.IsDevelopment())
            {
                app.UseSwagger();
                app.UseSwaggerUI();
            }

            app.UseHttpsRedirection();

            app.UseAuthorization();
            app.MapControllers(); // ��������� ��������� ������������

            // ��������� SPA
            //app.UseSpa(spa =>
            //{
            //    spa.Options.SourcePath = "ClientApp";

            //    if (app.Environment.IsDevelopment())
            //    {
            //        spa.UseReactDevelopmentServer(npmScript: "start");
            //    }
            //});
            app.MapFallbackToFile("/index.html");

            app.Run(); // ������ ����������
        }
    }
}


/*
var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

app.UseDefaultFiles();
app.UseStaticFiles();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.MapFallbackToFile("/index.html");

app.Run();
*/