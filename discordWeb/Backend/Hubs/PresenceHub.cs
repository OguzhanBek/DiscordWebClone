using System.Security.Claims;
using Backend.Service;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;

namespace Backend.Hubs;

public class PresenceHub : Hub
{
    private readonly AppDbContext _context;

    public PresenceHub(AppDbContext context)
    {
        _context = context;
    }
    // Bu fonklsyionun adı getonline users ama online arkadaşlarımı buluyor sadece. Sokete giriş yapan kullanıcılardan benle arkadaş olanları alıyorum.
    public async Task GetOnlineUsers()
    {
        var userId = Context.User?
            .FindFirst(ClaimTypes.NameIdentifier)?.Value;

        if (userId == null) return;

        var user = await _context.Users
            .Where(u => u.UserId == userId)
            .Select(u => new
            {
                u.UserId,
                u.UserName
            })
            .FirstOrDefaultAsync();

        if (user == null) return;

        var friendIds = await GetUserFriendIds(userId);

        var onlineUsers = OnlineUserStore.Users
            .Where(u => u.FriendId != user.UserId && friendIds.Contains(u.FriendId))
            .ToList();

        await Clients.Caller.SendAsync("initialOnlineUsers", onlineUsers);
        Console.WriteLine($"Online friends sent: {onlineUsers.Count}");
    }
    // Bağlanan kullanıcıları onineuserstore verisine ekliyorum. Ardından arkadaşlara initialonlineusers endpointinden kendim hariç herkesin online durumunu yolluyorum. Arkadaşlar için de ayrı endpoint var. Orada kendi bilgiliermi arkadaşlara yolluyorum.
    public override async Task OnConnectedAsync()
    {
        var userId = Context.User?
            .FindFirst(ClaimTypes.NameIdentifier)?.Value;

        if (userId == null) return;

        var user = await _context.Users
            .Where(u => u.UserId == userId)
            .Select(u => new
            {
                u.UserId,
                u.UserName
            })
            .FirstOrDefaultAsync();

        if (user == null) return;

        if (!OnlineUserStore.Users.Any(x => x.FriendId == user.UserId))
        {
            OnlineUserStore.Users.Add(new OnlineUserDto
            {
                FriendId = user.UserId,
                UserName = user.UserName
            });
        }

        Console.WriteLine($"{user.UserName} connected. Online count: {OnlineUserStore.Users.Count}");

        var friendIds = await GetUserFriendIds(userId);

        var onlineUsersExceptMe = OnlineUserStore.Users
            .Where(u => u.FriendId != user.UserId && friendIds.Contains(u.FriendId))
            .ToList();

        await Clients.Caller.SendAsync("initialOnlineUsers", onlineUsersExceptMe);

        var usersWhoAreFriendsWithMe = OnlineUserStore.Users
            .Where(u => u.FriendId != user.UserId)
            .Select(u => u.FriendId)
            .ToList();

        var friendsToNotify = await _context.Friends
            .Where(f =>
                (f.UserId1 == userId || f.UserId2 == userId) &&
                f.Status == "Accepted" &&
                usersWhoAreFriendsWithMe.Contains(f.UserId1 == userId ? f.UserId2 : f.UserId1))
            .Select(f => f.UserId1 == userId ? f.UserId2 : f.UserId1)
            .ToListAsync();

        foreach (var friendId in friendsToNotify)
        {
            await Clients.User(friendId).SendAsync(
                "useronline",
                new OnlineUserDto
                {
                    FriendId = user.UserId,
                    UserName = user.UserName
                }
            );
        }

        await base.OnConnectedAsync();
    }

    public override async Task OnDisconnectedAsync(Exception? ex)
    {
        var userId = Context.User?
            .FindFirst(ClaimTypes.NameIdentifier)?.Value;

        if (userId != null)
        {
            var user = OnlineUserStore.Users
                .FirstOrDefault(x => x.FriendId == userId);

            if (user != null)
            {
                OnlineUserStore.Users.Remove(user);

                // Sadece arkadaşlarına offline olduğunu bildir
                var friendIds = await GetUserFriendIds(userId);
                foreach (var friendId in friendIds)
                {
                    await Clients.User(friendId).SendAsync("useroffline", userId);
                }
            }

            Console.WriteLine(
                $"❌ {userId} disconnected. Online count: {OnlineUserStore.Users.Count}"
            );
        }

        await base.OnDisconnectedAsync(ex);
    }

    private async Task<List<string>> GetUserFriendIds(string userId)
    {
        var friendIds = await _context.Friends
            .Where(f =>
                (f.UserId1 == userId || f.UserId2 == userId) &&
                f.Status == "Accepted")
            .Select(f => f.UserId1 == userId ? f.UserId2 : f.UserId1)
            .ToListAsync();

        return friendIds;
    }
}