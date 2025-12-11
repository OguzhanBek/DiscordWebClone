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
                        public async Task<IActionResult> Login([FromBody] LoginRequest request)
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
                                    var user = await _context.Users.FirstOrDefaultAsync(u => u.email == request.email);

                                    if (user == null || !BCrypt.Net.BCrypt.Verify(request.password, user.password_hash))
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
                                                UserId = user.user_id,
                                                UserName = user.user_name,
                                                Email = user.email
                                    });
                        }

                        [HttpPost("register")]
                        public async Task<IActionResult> Register([FromBody] User request)
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
                                    if (await _context.Users.AnyAsync(u => u.email == request.email))
                                    {
                                                return BadRequest(new LoginResponse
                                                {
                                                            Success = false,
                                                            Message = "Bu email adresi zaten kullanılıyor"
                                                });
                                    }

                                    // Dinamik user_id oluştur (mevcut max id + 1)
                                    var maxUserId = await _context.Users.MaxAsync(u => (int?)u.user_id) ?? 0;

                                    // Yeni kullanıcı oluştur
                                    var newUser = new DbUser
                                    {
                                                user_id = maxUserId + 1,
                                                email = request.email,
                                                user_name = request.user_name,
                                                password_hash = BCrypt.Net.BCrypt.HashPassword(request.password, 13)
                                    };

                                    Console.WriteLine($"New user: {newUser.user_id} {newUser.user_name} {newUser.email}");

                                    _context.Users.Add(newUser);
                                    await _context.SaveChangesAsync();
                                    var token = GenerateJwtToken(newUser);
                                    var expiresAt = DateTime.UtcNow.AddHours(2);
                                    return Ok(new LoginResponse
                                    {
                                                Success = true,
                                                Message = "Kayıt başarılı, şimdi giriş yapabilirsiniz",
                                                UserId = newUser.user_id,
                                                UserName = newUser.user_name,
                                                Email = newUser.email,
                                                Token = token,
                                                ExpiresAt = expiresAt,
                                    });
                        }

                        private string GenerateJwtToken(DbUser user)
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
                new Claim(ClaimTypes.NameIdentifier, user.user_id.ToString()),

                new Claim(ClaimTypes.Email, user.email ),
                new Claim(ClaimTypes.Name, user.user_name ?? user.email),
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
            };

                                    var token = new JwtSecurityToken(
                                        issuer: jwtSettings["Issuer"],
                                        audience: jwtSettings["Audience"],
                                        claims: claims,
                                        expires: DateTime.UtcNow.AddHours(2),
                                        signingCredentials: credentials
                                    );

                                    return new JwtSecurityTokenHandler().WriteToken(token);
                        }
            }
}