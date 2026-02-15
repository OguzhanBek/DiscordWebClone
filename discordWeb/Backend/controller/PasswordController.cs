using System.Security.Claims;
using Backend.Service;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;


[ApiController]
[Route("api/[controller]")]
public class PasswordController : ControllerBase
{
  private readonly AppDbContext _context;
  public PasswordController(AppDbContext context)
  {
    _context = context;
  }

  [Authorize]
  [HttpPost("changePassword")]
  public async Task<IActionResult> ChangePassword([FromBody] ChangePasswordDto model)
  {
    // 🔍 DEBUG: Model geldi mi?
    Console.WriteLine("=== CHANGE PASSWORD DEBUG ===");
    Console.WriteLine($"Model is null: {model == null}");
    if (model != null)
    {
      Console.WriteLine($"CurrentPassword: {model.CurrentPassword}");
      Console.WriteLine($"NewPassword: {model.NewPassword}");
      Console.WriteLine($"NewPasswordConfirm: {model.NewPasswordConfirm}");
    }

    var useridFromToken = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

    // 🔍 DEBUG: Token'dan user ID geldi mi?
    Console.WriteLine($"User ID from token: {useridFromToken ?? "NULL"}");

    if (string.IsNullOrEmpty(useridFromToken))
    {
      Console.WriteLine("❌ User ID bulunamadı!");
      return Unauthorized("User ID not found in token.");
    }

    var user = await _context.Users.FirstOrDefaultAsync(u => u.UserId == useridFromToken);

    // 🔍 DEBUG: User bulundu mu?
    Console.WriteLine($"User found: {user != null}");
    if (user != null)
    {
      Console.WriteLine($"User Email: {user.Email}");
    }

    if (user == null)
    {
      Console.WriteLine("❌ Kullanıcı veritabanında bulunamadı!");
      return BadRequest("Kullanıcı bulunamadı");
    }

    // 🔍 DEBUG: Şifreler eşleşiyor mu?
    Console.WriteLine($"NewPassword == NewPasswordConfirm: {model?.NewPassword == model?.NewPasswordConfirm}");

    if (model?.NewPassword != model?.NewPasswordConfirm)
    {
      Console.WriteLine("❌ Yeni şifreler uyuşmuyor!");
      return BadRequest("iki yeni şifre ile onaylanması gerekn şifre uyuşmuyor.");
    }

    // 🔍 DEBUG: Mevcut şifre doğrulanıyor
    Console.WriteLine("Verifying current password...");
    bool isPasswordValid = BCrypt.Net.BCrypt.Verify(
        model?.CurrentPassword,
        user.PasswordHash
    );

    Console.WriteLine($"Password valid: {isPasswordValid}");

    if (!isPasswordValid)
    {
      Console.WriteLine("❌ Mevcut şifre yanlış!");
      return BadRequest("Mevcut şifren yanlış");
    }

    Console.WriteLine("✅ Hashing new password...");
    string newHashedPassword = BCrypt.Net.BCrypt.HashPassword(
        model?.NewPassword
    );

    user.PasswordHash = newHashedPassword;
    await _context.SaveChangesAsync();

    Console.WriteLine("✅ Şifre başarıyla değiştirildi!");
    Console.WriteLine("=== DEBUG END ===");

    return Ok(new { message = "Şifre başarıyla değiştirildi" });
  }
}