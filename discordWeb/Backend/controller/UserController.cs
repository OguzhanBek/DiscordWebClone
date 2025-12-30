using Backend.Service;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private AppDbContext _dbContext;

        public UserController(AppDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        // Yeni endpoint - token'dan otomatik user bilgisi
        [HttpGet("me")]
        [Authorize] // JWT Authentication gerekli
        public async Task<IActionResult> GetCurrentUser()
        {
            // Token'dan user_id'yi al
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            
            if (string.IsNullOrEmpty(userId))
                return Unauthorized("Invalid token");

            var user = await _dbContext.Users
                .FirstOrDefaultAsync(u => u.UserId == userId);

            if (user == null)
                return NotFound("User not found");

            return Ok(new
            {
                email = user.Email,
                user_name = user.UserName
            });
        }

//         // Eski endpoint - ID ile kullanıcı getir
//         [HttpGet("{userId}")]
//         public async Task<IActionResult> GetUser(string userId)
//         {
//             var user = await _dbContext.Users
//                 .FirstOrDefaultAsync(u => u.user_id == userId);

//             if (user == null)
//                 return NotFound("User not found");

//             return Ok(new
//             {
//                 email = user.email,
//                 user_name = user.user_name
//             });
//         }
    }
}