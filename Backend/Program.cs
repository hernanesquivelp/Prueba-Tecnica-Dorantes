using System;
using Microsoft.EntityFrameworkCore;
using Prueba_Tecnica.Data;
using Serilog;

var builder = WebApplication.CreateBuilder(args);

// Paso 1: Configurar Serilog para escribir los logs en un archivo
builder.Host.UseSerilog((context, loggerConfig) =>
    loggerConfig.WriteTo.File("logs/log-.txt", rollingInterval: RollingInterval.Day));

// Paso 2: Agregar servicios al contenedor (esto siempre va primero)
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Definir la política de CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("CorsPolicy",
        builder => builder.AllowAnyOrigin()
            .AllowAnyMethod()
            .AllowAnyHeader());
});

// Configurar la conexión a la base de datos
builder.Services.AddDbContext<AppDBContext>(options =>
{
    options.UseSqlServer(builder.Configuration.GetConnectionString("CadenaSQL"));
});

var app = builder.Build();

// Paso 3: Configurar el pipeline de solicitudes HTTP (el orden es vital)
app.UseHttpsRedirection();

// El middleware de CORS y Swagger se aplican solo en desarrollo y deben ir antes de la autorización.
if (app.Environment.IsDevelopment())
{
    app.UseCors("CorsPolicy");
    app.UseSwagger();
    app.UseSwaggerUI();
}

// El middleware de autorización siempre va después de CORS y Swagger.
app.UseAuthorization();

app.MapControllers();

app.Run();