using System.Security.Claims;
using Backend.Service;
using LoginAPI.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace ChatController.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ChatController : ControllerBase
    {
        private readonly IConfiguration _configuration;
        private readonly AppDbContext _context;

        public ChatController(IConfiguration configuration, AppDbContext context)
        {
            _configuration = configuration;
            _context = context;
        }

        [Authorize]
        [HttpPost("create")]
        public async Task<IActionResult> Create([FromBody] CreateDirectConversation request = null!)
        {
            if (request == null)
            {
                return BadRequest("request boş");
            }

            var myUserId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (myUserId == null)
                return Unauthorized();

            var targetUserId = request.FriendId;

            if (myUserId == targetUserId)
                return BadRequest("Kendine mesaj atamazsın");

            // Arkadaşın bilgilerini çek
            var friend = await _context.Users
                .Where(u => u.UserId == targetUserId)
                .Select(u => new { u.UserId, u.UserName })
                .FirstOrDefaultAsync();

            if (friend == null)
                return BadRequest("Kullanıcı bulunamadı");

            // Mevcut konuşmayı kontrol et
            var conversationId = await _context.DirectParticipants
                .Where(dp => dp.UserId == myUserId || dp.UserId == targetUserId)
                .GroupBy(dp => dp.ConversationId)
                .Where(g => g.Select(x => x.UserId).Distinct().Count() == 2)
                .Select(g => g.Key)
                .FirstOrDefaultAsync();

            if (conversationId == null)
            {
                var conversation = new DirectConversation
                {
                    CreatedAt = DateTime.UtcNow,
                    Id = Guid.NewGuid().ToString(),
                };

                _context.DirectConversations.Add(conversation);
                await _context.SaveChangesAsync();

                conversationId = conversation.Id;

                _context.DirectParticipants.AddRange(
                    new DirectParticipant
                    {
                        Id = Guid.NewGuid().ToString(),
                        ConversationId = conversationId,
                        UserId = myUserId,
                        JoinedAt = DateTime.UtcNow
                    },
                    new DirectParticipant
                    {
                        Id = Guid.NewGuid().ToString(),
                        ConversationId = conversationId,
                        UserId = targetUserId,
                        JoinedAt = DateTime.UtcNow
                    }
                );

                await _context.SaveChangesAsync();
            }

            return Ok(new
            {
                ConversationId = conversationId,
                FriendName = friend.UserName
            });
        }
        [Authorize]
        [HttpGet("{conversationId}/messages")]
        public async Task<IActionResult> GetMessages(string conversationId)
        {
            var myUserId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            var isParticipant = await _context.DirectParticipants
                .AnyAsync(p =>
                    p.ConversationId == conversationId &&
                    p.UserId == myUserId);

            if (!isParticipant)
                return Forbid();

            // Karşı tarafın bilgisini bul
            var otherUser = await _context.DirectParticipants
                .Where(dp => dp.ConversationId == conversationId && dp.UserId != myUserId)
                .Join(_context.Users,
                    dp => dp.UserId,
                    user => user.UserId,
                    (dp, user) => new
                    {
                        user.UserId,
                        user.UserName
                    })
                .FirstOrDefaultAsync();

            var messages = await _context.DirectMessages
                .Where(m => m.ConversationId == conversationId)
                .Join(_context.Users,
                    msg => msg.AuthorUserId,
                    user => user.UserId,
                    (msg, user) => new
                    {
                        msg.ConversationId,
                        msg.AuthorUserId,
                        AuthorUsername = user.UserName,
                        msg.Content,
                        msg.CreatedAt,
                        msg.EditedAt
                    })
                .OrderBy(m => m.CreatedAt)
                .ToListAsync();

            return Ok(new
            {
                FriendName = otherUser,
                Messages = messages
            });
        }
        [Authorize]
        [HttpGet("{conversationId}/dmUser")]
        public async Task<IActionResult> GetDmUser(string conversationId) // .net otomatik olarak URL'deki adı parametre olarak alıyor. 
        {
            return Ok("");
        }
        [Authorize]
        [HttpPost("{conversationId}/message")]
        public async Task<IActionResult> SendMessage(string conversationId, [FromBody] SendMessageDto dto)
        {
            var myUserId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (myUserId == null) return Unauthorized();

            var isParticipant = await _context.DirectParticipants
                .AnyAsync(p =>
                    p.ConversationId == conversationId &&
                    p.UserId == myUserId);

            if (!isParticipant)
                return Forbid();

            var message = new DirectMessage
            {
                Id = Guid.NewGuid().ToString(),
                ConversationId = conversationId,
                AuthorUserId = myUserId,
                Content = dto.Content,
                CreatedAt = DateTime.UtcNow,
            };

            _context.DirectMessages.Add(message);
            await _context.SaveChangesAsync();

            // ✅ Username'i de ekle
            var user = await _context.Users.FindAsync(myUserId);

            return Ok(new
            {
                message.Id,
                message.ConversationId,
                message.AuthorUserId,
                AuthorUsername = user?.UserName, // ✅ Eklendi
                message.Content,
                message.CreatedAt,
                message.EditedAt
            });
        }
    }
}