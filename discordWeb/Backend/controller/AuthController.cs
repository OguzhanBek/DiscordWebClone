// Controllers/AuthController.cs
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using LoginAPI.Models;
using Backend.Service;

namespace LoginAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly IConfiguration _configuration;
        private readonly AppDbContext _context;


        public AuthController(IConfiguration configuration, AppDbContext context)
        {
            _configuration = configuration;
            _context = context;
        }
        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginRequest request = null!)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(new LoginResponse
                {
                    Success = false,
                    Message = "Geçersiz giriş bilgileri"
                });
            }

            // Kullanıcıyı veritabanından bul
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == request.Email);

            if (user == null || !BCrypt.Net.BCrypt.Verify(request.Password, user.PasswordHash))
            {
                return Unauthorized(new LoginResponse
                {
                    Success = false,
                    Message = "Email veya şifre hatalı"
                });
            }

            // JWT token oluştur
            var token = GenerateJwtToken(user);
            var expiresAt = DateTime.UtcNow.AddHours(2);
            return Ok(new LoginResponse
            {
                Success = true,
                Message = "Giriş başarılı",
                Token = token,
                ExpiresAt = expiresAt,
                UserId = user.UserId,
                UserName = user.UserName,
                Email = user.Email
            });
        }

        [HttpPost("register")]

        public async Task<IActionResult> Register([FromBody] RegisterModel request = null!)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(new LoginResponse
                {
                    Success = false,
                    Message = "Geçersiz kayıt bilgileri"
                });
            }

            // Email kontrolü
            if (await _context.Users.AnyAsync(u => u.Email == request.Email))
            {
                return BadRequest(new LoginResponse
                {
                    Success = false,
                    Message = "Bu email adresi zaten kullanılıyor"
                });
            }

            // UserName kontrolü (opsiyonel)
            if (await _context.Users.AnyAsync(u => u.UserName == request.UserName))
            {
                return BadRequest(new LoginResponse
                {
                    Success = false,
                    Message = "Bu kullanıcı adı zaten kullanılıyor"
                });
            }

            // Yeni kullanıcı oluştur - UserId otomatik generate edilecek (DB'de IDENTITY ise)
            // Eğer manuel ID oluşturmanız gerekiyorsa Guid.NewGuid().ToString() kullanabilirsiniz
            var newUser = new User
            {
                UserId = Guid.NewGuid().ToString(),
                Email = request.Email,
                UserName = request.UserName ?? string.Empty,
                PasswordHash = BCrypt.Net.BCrypt.HashPassword(request.Password, 13),
                CreatedAt = DateTime.UtcNow,
            };

            Console.WriteLine($"New user: {newUser.UserName} {newUser.Email}");

            _context.Users.Add(newUser);
            await _context.SaveChangesAsync();

            // JWT token oluştur (Login ile aynı şekilde)
            var token = GenerateJwtToken(newUser);
            var expiresAt = DateTime.UtcNow.AddHours(5);

            return Ok(new LoginResponse
            {
                Success = true,
                Message = "Kayıt başarılı",
                UserId = newUser.UserId,
                UserName = newUser.UserName,
                Email = newUser.Email,
                Token = token,
                ExpiresAt = expiresAt,
            });
        }


        private string GenerateJwtToken(User user)
        {
            var jwtSettings = _configuration.GetSection("JwtSettings");
            var secretKey = jwtSettings["SecretKey"];

            if (string.IsNullOrEmpty(secretKey))
            {
                throw new InvalidOperationException("JWT SecretKey is not configured");
            }

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secretKey));
            var credentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var claims = new[]
            {
                new Claim(ClaimTypes.NameIdentifier, user.UserId.ToString()),

                new Claim(ClaimTypes.Email, user.Email ),
                new Claim(ClaimTypes.Name, user.UserName ?? user.Email),
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
            };

            var token = new JwtSecurityToken(
                issuer: jwtSettings["Issuer"],
                audience: jwtSettings["Audience"],
                claims: claims,
                expires: DateTime.UtcNow.AddHours(5),
                signingCredentials: credentials
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }
}