using Microsoft.AspNetCore.SignalR;
using System.Security.Claims;
using Microsoft.EntityFrameworkCore;
using Backend.Service;

namespace Backend.Hubs;

public class EditHub : Hub
{
            private readonly AppDbContext _context;

            public EditHub(AppDbContext context)
            {
                        _context = context;
            }

            public override async Task OnConnectedAsync()
            {
                        var userId = Context.User?.FindFirst(ClaimTypes.NameIdentifier)?.Value;

                        if (userId != null)
                        {
                                    Console.WriteLine($"EditHub - user : {userId}");
                                    await Groups.AddToGroupAsync(Context.ConnectionId, $"user_{userId}");
                        }
                        else
                        {
                                    Console.WriteLine("UserId bulunamadı!");
                        }
                        await base.OnConnectedAsync();
            }

            public async Task UpdateUsername(string newUsername, string password)
            {
                        var userId = Context.User?.FindFirst(ClaimTypes.NameIdentifier)?.Value;
                        if (string.IsNullOrEmpty(userId)) throw new HubException("Unauthorized");

                        try
                        {
                                    if (string.IsNullOrWhiteSpace(newUsername))
                                    {
                                                await Clients.Caller.SendAsync("UpdateError", "Kullanıcı adı boş olamaz");
                                                return;
                                    }

                                    if (string.IsNullOrWhiteSpace(password))
                                    {
                                                await Clients.Caller.SendAsync("UpdateError", "Şifre gerekli");
                                                return;
                                    }

                                    var user = await _context.Users.FirstOrDefaultAsync(u => u.UserId == userId);
                                    if (user == null)
                                    {
                                                await Clients.Caller.SendAsync("UpdateError", "Kullanıcı bulunamadı");
                                                return;
                                    }

                                    if (!BCrypt.Net.BCrypt.Verify(password, user.PasswordHash))
                                    {
                                                await Clients.Caller.SendAsync("UpdateError", "Şifre hatalı");
                                                return;
                                    }

                                    user.UserName = newUsername;
                                    await _context.SaveChangesAsync();
                                    var onlineUser = OnlineUserStore.Users.FirstOrDefault(u => u.FriendId == userId);
                                    if (onlineUser != null)
                                                onlineUser.UserName = newUsername;
                                    Console.WriteLine($"Username updated: {userId} -> {newUsername}");

                                    await BroadcastUserUpdated(userId, newUsername, null);

                                    await Clients.Caller.SendAsync("UpdateSuccess", newUsername);

                        }
                        catch (Exception ex)
                        {
                                    Console.WriteLine($"Error updating username: {ex.Message}");
                                    await Clients.Caller.SendAsync("UpdateError", "Güncelleme sırasında hata oluştu");
                        }
            }

            public async Task UpdateProfilePhoto(string newPhotoUrl)
            {
                        var userId = Context.User?.FindFirst(ClaimTypes.NameIdentifier)?.Value;
                        if (string.IsNullOrEmpty(userId)) throw new HubException("Unauthorized");

                        try
                        {
                                    var user = await _context.Users.FirstOrDefaultAsync(u => u.UserId == userId);
                                    if (user == null)
                                    {
                                                await Clients.Caller.SendAsync("UpdateError", "Kullanıcı bulunamadı");
                                                return;
                                    }

                                    user.ProfilePhoto = newPhotoUrl;
                                    await _context.SaveChangesAsync();

                                    
                                    var onlineUser = OnlineUserStore.Users.FirstOrDefault(u => u.FriendId == userId);
                                    if (onlineUser != null)
                                                onlineUser.ProfilePhoto = newPhotoUrl;

                                    
                                    await BroadcastUserUpdated(userId, null, newPhotoUrl);
                                    await Clients.Caller.SendAsync("PhotoUpdateSuccess", newPhotoUrl);
                        }
                        catch (Exception ex)
                        {
                                    Console.WriteLine($"Error updating photo: {ex.Message}");
                                    await Clients.Caller.SendAsync("UpdateError", "Fotoğraf güncellenirken hata oluştu");
                        }
            }

            private async Task BroadcastUserUpdated(string userId, string? newUsername, string? newPhotoUrl)
            {
                        var friendIds = await _context.Friends
                            .Where(f =>
                                (f.UserId1 == userId || f.UserId2 == userId) &&
                                f.Status == "Accepted")
                            .Select(f => f.UserId1 == userId ? f.UserId2 : f.UserId1)
                            .ToListAsync();

                        var payload = new
                        {
                                    UserId = userId,
                                    UserName = newUsername,
                                    ProfilePhoto = newPhotoUrl
                        };

                        foreach (var friendId in friendIds)
                        {
                                    await Clients.User(friendId).SendAsync("UserUpdated", payload);
                        }

                        await Clients.Caller.SendAsync("UserUpdated", payload);
            }

            public override async Task OnDisconnectedAsync(Exception? exception)
            {
                        var userId = Context.User?.FindFirst(ClaimTypes.NameIdentifier)?.Value;
                        if (userId != null)
                        {
                                    await Groups.RemoveFromGroupAsync(Context.ConnectionId, $"user_{userId}");
                        }
                        await base.OnDisconnectedAsync(exception);
            }
}