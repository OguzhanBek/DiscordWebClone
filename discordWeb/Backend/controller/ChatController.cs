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

            var targetsUserId = request.FriendId;

            if (targetsUserId.Contains(myUserId))
                return BadRequest("Kendine mesaj atamazsın");

            // Arkadaşın bilgilerini çek
            var friends = await _context.Users
                .Where(u => targetsUserId.Contains(u.UserId))
                .Select(u => new { u.UserId, u.UserName })
                .ToListAsync();

            if (friends == null || friends.Count == 0)
                return BadRequest("Kullanıcı bulunamadı");

            // Mevcut conversation'u kontrol et
            var allUserIds = targetsUserId.Append(myUserId).OrderBy(x => x).ToList();

            // ✅ KAPSAMLI DÜZELTME: Tam olarak aynı katılımcılara sahip conversation'ı bul
            var existingConversations = await _context.DirectParticipants
                .GroupBy(dp => dp.ConversationId)
                .Select(g => new
                {
                    ConversationId = g.Key,
                    UserIds = g.Select(x => x.UserId).OrderBy(x => x).ToList()
                })
                .ToListAsync();

            // Memory'de karşılaştır (LINQ to Objects)
            var conversationId = existingConversations
                .FirstOrDefault(c =>
                    c.UserIds.Count == allUserIds.Count &&
                    c.UserIds.SequenceEqual(allUserIds)
                )?.ConversationId;


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

                var participants = new List<DirectParticipant>();

                foreach (var friendId in allUserIds)
                {
                    participants.Add(new DirectParticipant
                    {
                        Id = Guid.NewGuid().ToString(),
                        ConversationId = conversationId,
                        UserId = friendId,
                        JoinedAt = DateTime.UtcNow
                    });
                }
                _context.DirectParticipants.AddRange(participants);
                await _context.SaveChangesAsync();

            }
            var friendsName = friends.Select(friends => friends.UserName);
            return Ok(new
            {
                ConversationId = conversationId,
                FriendName = friendsName
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
            var otherUsers = await _context.DirectParticipants
                .Where(dp => dp.ConversationId == conversationId && dp.UserId != myUserId)
                .Join(_context.Users,
                    dp => dp.UserId,
                    user => user.UserId,
                    (dp, user) => new
                    {
                        user.UserId,
                        user.UserName
                    })
                .ToListAsync();

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
                FriendName = otherUsers.Select(friend => friend.UserName),
                Messages = messages
            });
        }
        [Authorize]
        [HttpGet("getConversationList")]
        public async Task<IActionResult> GetConversations()
        {
            var myId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (myId == null)
                return Unauthorized();

            // 1️⃣ Benim dahil olduğum conversationId'ler
            var myConversationIds = await _context.DirectParticipants
                .Where(dp => dp.UserId == myId)
                .Select(dp => dp.ConversationId)
                .Distinct()
                .ToListAsync();

            // 2️⃣ Bu conversation'lardaki DİĞER kullanıcılar
            var conversations = await _context.DirectParticipants
                .Where(dp =>
                    myConversationIds.Contains(dp.ConversationId) &&
                    dp.UserId != myId
                )
                .Join(
                    _context.Users,
                    dp => dp.UserId,
                    u => u.UserId,
                    (dp, u) => new
                    {
                        ConversationId = dp.ConversationId,
                        FriendId = u.UserId,
                        UserName = u.UserName
                    }
                )
                .ToListAsync();

            return Ok(conversations);
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

            var user = await _context.Users.FindAsync(myUserId);

            return Ok(new
            {
                message.Id,
                message.ConversationId,
                message.AuthorUserId,
                AuthorUsername = user?.UserName,
                message.Content,
                message.CreatedAt,
                message.EditedAt
            });
        }
    }
}