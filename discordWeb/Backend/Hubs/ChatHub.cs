using Microsoft.AspNetCore.SignalR;
using System.Security.Claims;
using LoginAPI.Models;
using Microsoft.EntityFrameworkCore;
using Backend.Service;

namespace Backend.Hubs;

public class ChatHub : Hub
{
    private readonly AppDbContext _context;

    public ChatHub(AppDbContext context)
    {
        _context = context;
    }

    // Kullanıcı bağlandığında
    public override async Task OnConnectedAsync()
    {
        var userId = Context.User?.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (userId != null)
        {
            Console.WriteLine($"ChatHub - user : {userId}");
            var conversationIds = await _context.DirectParticipants
                .Where(p => p.UserId == userId)
                .Select(p => p.ConversationId)
                .ToListAsync();

            foreach (var id in conversationIds)
            {
                await Groups.AddToGroupAsync(Context.ConnectionId, id);
            }
        }
        await base.OnConnectedAsync();
    }

    // Kullanıcı ayrıldığında
    public override async Task OnDisconnectedAsync(Exception? exception)
    {
        var userId = Context.User?.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        Console.WriteLine($"❌ User {userId} disconnected");
        await base.OnDisconnectedAsync(exception);
    }

    public async Task SendMessage(string conversationId, string content)
    {
        var userId = Context.User?.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (string.IsNullOrEmpty(userId)) throw new HubException("Unauthorized");

        var isParticipant = await _context.DirectParticipants
            .AnyAsync(p => p.ConversationId == conversationId && p.UserId == userId);

        if (!isParticipant) throw new HubException("Bu sohbette değilsiniz");

        var message = new DirectMessage
        {
            Id = Guid.NewGuid().ToString(),
            ConversationId = conversationId,
            AuthorUserId = userId,
            Content = content,
            CreatedAt = DateTime.UtcNow,
        };

        _context.DirectMessages.Add(message);
        await _context.SaveChangesAsync();

        var user = await _context.Users.FindAsync(userId);

        await Clients.Group(conversationId).SendAsync("ReceiveMessage", new
        {
            conversationId = message.ConversationId,
            authorUserId = message.AuthorUserId,
            authorUsername = user?.UserName ?? "adım yok",
            content = message.Content,
            createdAt = message.CreatedAt
        });
    }

    public async Task JoinConversation(string conversationId)
    {
        var userId = Context.User?.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (string.IsNullOrEmpty(userId)) return;

        var isParticipant = await _context.DirectParticipants
            .AnyAsync(p => p.ConversationId == conversationId && p.UserId == userId);

        if (!isParticipant)
        {
            Console.WriteLine($"⚠️ User {userId} is not a participant of {conversationId}");
            return;
        }

        await Groups.AddToGroupAsync(Context.ConnectionId, conversationId);
        Console.WriteLine($"✅ User {userId} joined conversation {conversationId}");
    }

    public async Task LeaveConversation(string conversationId)
    {
        await Groups.RemoveFromGroupAsync(Context.ConnectionId, conversationId);
        Console.WriteLine($"🚪 User left conversation {conversationId}");
    }
    public async Task UserTyping(string conversationId, bool isTyping)
    {
        var userId = Context.User?.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (string.IsNullOrEmpty(userId)) throw new HubException("Unauthorized");

        var isParticipant = await _context.DirectParticipants
            .AnyAsync(p => p.ConversationId == conversationId && p.UserId == userId);

        if (!isParticipant) throw new HubException("Bu sohbette değilsiniz");

        var user = await _context.Users.FindAsync(userId);

        // Kendisi hariç diğer kullanıcılara typing durumunu bildir
        await Clients.GroupExcept(conversationId, Context.ConnectionId).SendAsync("UserTyping", new
        {
            conversationId = conversationId,
            userId = userId,
            username = user?.UserName ?? "Bilinmeyen",
            isTyping = isTyping
        });
    }
}