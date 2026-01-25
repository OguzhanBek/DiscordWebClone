using Microsoft.EntityFrameworkCore;
using Backend.Service;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using Backend.Hubs; // 👈 ChatHub için

var builder = WebApplication.CreateBuilder(args);

// ===================== CORS =====================
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy.WithOrigins("http://localhost:5173")
              .AllowAnyHeader()
              .AllowAnyMethod()
              .AllowCredentials();
    });
});

// ===================== Controllers & Swagger =====================
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// ===================== EF Core =====================
builder.Services.AddDbContext<AppDbContext>(options =>
{
    options.UseSqlServer(
        builder.Configuration.GetConnectionString("DefaultConnection")
    );
});

// ===================== JWT =====================
var jwtSettings = builder.Configuration.GetSection("JwtSettings");
var secretKey = jwtSettings["SecretKey"];

if (string.IsNullOrEmpty(secretKey))
{
    throw new InvalidOperationException("JWT SecretKey is not configured");
}

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = jwtSettings["Issuer"],
            ValidAudience = jwtSettings["Audience"],
            IssuerSigningKey = new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes(secretKey)
            ),
            ClockSkew = TimeSpan.Zero
        };

        // 🔥 SIGNALR JWT İÇİN ŞART
        options.Events = new JwtBearerEvents
        {
            OnMessageReceived = context =>
            {
                var accessToken = context.Request.Query["access_token"];
                var path = context.HttpContext.Request.Path;

                if (!string.IsNullOrEmpty(accessToken) &&
                    (path.StartsWithSegments("/hub/chat") ||
                     path.StartsWithSegments("/hub/presence")))
                {
                    context.Token = accessToken;
                    Console.WriteLine($"✅ Token set for hub connection");
                }

                return Task.CompletedTask;
            }
        };
    });

builder.Services.AddAuthorization();

// ===================== SIGNALR =====================
builder.Services.AddSignalR();

// ===================== APP =====================
var app = builder.Build();

app.UseCors("AllowFrontend");

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

//  SIRA ÖNEMLİ
app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

// SIGNALR HUB ROUTE
app.MapHub<ChatHub>("/hub/chat");
app.MapHub<PresenceHub>("/hub/presence");
app.Run();
