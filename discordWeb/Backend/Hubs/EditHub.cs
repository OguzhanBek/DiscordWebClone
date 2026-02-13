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
                                    Console.WriteLine("❌ UserId bulunamadı!");
                        }
                        await base.OnConnectedAsync();
            }

            public async Task UpdateUsername(string newUsername, string password)
            {

                        var userId = Context.User?.FindFirst(ClaimTypes.NameIdentifier)?.Value;
                        if (string.IsNullOrEmpty(userId)) throw new HubException("Unauthorized");
                        Console.WriteLine($"UpdateUsername user id : {userId}");
                        if (userId == null)
                        {
                                    await Clients.Caller.SendAsync("UpdateError", $"Kullanıcı bulunamadı {userId}");
                                    return;
                        }

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

                                    // var existingUser = await _context.Users
                                    //     .FirstOrDefaultAsync(u => u.UserName == newUsername && u.UserId != userId);
                                    // if (existingUser != null)
                                    // {
                                    //             await Clients.Caller.SendAsync("UpdateError", "Bu kullanıcı adı zaten kullanılıyor");
                                    //             return;
                                    // } Buna ihtiyacım olabilir. Şu anlık böyle kalsın.

                                    user.UserName = newUsername;
                                    await _context.SaveChangesAsync();

                                    Console.WriteLine($"Username updated: {userId} -> {newUsername}");

                                    await Clients.All.SendAsync("UsernameChanged", userId, newUsername);  //Şimdilik askıya aldım biraz zorlayıcı.

                                    await Clients.Caller.SendAsync("UpdateSuccess", newUsername);
                        }
                        catch (Exception ex)
                        {
                                    Console.WriteLine($"Error updating username: {ex.Message}");
                                    await Clients.Caller.SendAsync("UpdateError", "Güncelleme sırasında hata oluştu");
                        }
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