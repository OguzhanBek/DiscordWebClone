using System.Security.Claims;
using Backend.Service;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

[Route("api/[controller]")]
[ApiController]
public class PhotoController : ControllerBase
{
            private readonly AppDbContext _context;
            private readonly IWebHostEnvironment _environment;

            public PhotoController(AppDbContext context, IWebHostEnvironment environment)
            {
                        _context = context;
                        _environment = environment;
            }

            [Authorize]
            [HttpPost]
            public async Task<IActionResult> ChangePhoto([FromForm] IFormFile photo)
            {
                        Console.WriteLine("🚀 ChangePhoto endpoint'e istek geldi");

                        // Token'dan user id al
                        var userIdFromToken = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
                        Console.WriteLine($"👤 User ID from token: {userIdFromToken}");

                        if (userIdFromToken == null)
                        {
                                    return Unauthorized("Kullanıcı authorize değil");
                        }

                        // User'ı bul
                        var user = await _context.Users.FirstOrDefaultAsync(u => u.UserId == userIdFromToken);
                        Console.WriteLine($"👤 User bulundu: {user?.UserName} - Mevcut foto: {user?.ProfilePhoto}");

                        if (user == null)
                        {
                                    return BadRequest(new { message = "Kullanıcı bulunamadı" });
                        }

                        // Dosya kontrolü
                        if (photo == null || photo.Length == 0)
                        {
                                    return BadRequest(new { message = "Lütfen bir fotoğraf seçin" });
                        }

                        Console.WriteLine($"📁 Gelen dosya: {photo.FileName} - Boyut: {photo.Length} bytes - ContentType: {photo.ContentType}");

                        // Dosya tipi kontrolü
                        var allowedExtensions = new[] { ".jpg", ".jpeg", ".png", ".gif", ".webp", ".jfif" };
                        var extension = Path.GetExtension(photo.FileName).ToLower();
                        Console.WriteLine($"📎 Extension: {extension}");

                        if (!allowedExtensions.Contains(extension))
                        {
                                    return BadRequest(new { message = "Sadece resim dosyaları yüklenebilir" });
                        }

                        // Dosya boyutu kontrolü (5MB)
                        if (photo.Length > 5 * 1024 * 1024)
                        {
                                    return BadRequest(new { message = "Dosya boyutu 5MB'dan küçük olmalıdır" });
                        }

                        // Eski fotoğrafı sil (varsa)
                        if (!string.IsNullOrEmpty(user.ProfilePhoto))
                        {
                                    Console.WriteLine($"🗑️ Eski fotoğraf siliniyor: {user.ProfilePhoto}");
                                    var oldPhotoPath = Path.Combine(_environment.WebRootPath, user.ProfilePhoto.TrimStart('/'));
                                    Console.WriteLine($"📍 Tam yol: {oldPhotoPath}");

                                    if (System.IO.File.Exists(oldPhotoPath))
                                    {
                                                System.IO.File.Delete(oldPhotoPath);
                                                Console.WriteLine("✅ Eski fotoğraf silindi");
                                    }
                                    else
                                    {
                                                Console.WriteLine("⚠️ Eski fotoğraf bulunamadı");
                                    }
                        }

                        // Yeni dosya adı oluştur
                        var uniqueFileName = $"{Guid.NewGuid()}{extension}";
                        Console.WriteLine($"🆕 Yeni dosya adı: {uniqueFileName}");

                        // Klasör yolu (wwwroot/uploads/avatars)
                        var uploadsFolder = Path.Combine(_environment.WebRootPath, "uploads", "avatars");
                        Console.WriteLine($"📁 Upload klasörü: {uploadsFolder}");

                        // Klasör yoksa oluştur
                        if (!Directory.Exists(uploadsFolder))
                        {
                                    Console.WriteLine("📁 Klasör oluşturuluyor...");
                                    Directory.CreateDirectory(uploadsFolder);
                        }

                        // Tam dosya yolu
                        var filePath = Path.Combine(uploadsFolder, uniqueFileName);
                        Console.WriteLine($"💾 Dosya kaydedilecek yer: {filePath}");

                        // Dosyayı kaydet
                        using (var fileStream = new FileStream(filePath, FileMode.Create))
                        {
                                    await photo.CopyToAsync(fileStream);
                        }
                        Console.WriteLine("✅ Dosya fiziksel olarak kaydedildi");

                        // Veritabanına URL'i kaydet
                        user.ProfilePhoto = $"/uploads/avatars/{uniqueFileName}";
                        Console.WriteLine($"💾 DB'ye kaydedilecek URL: {user.ProfilePhoto}");

                        await _context.SaveChangesAsync();
                        Console.WriteLine("✅ Veritabanı güncellendi");

                        var response = new
                        {
                                    message = "Fotoğraf değiştirildi",
                                    profilePhoto = user.ProfilePhoto
                        };

                        Console.WriteLine($"📤 Response gönderiliyor: {System.Text.Json.JsonSerializer.Serialize(response)}");

                        return Ok(response);
            }
}