using System.Security.Claims;
using Backend.DTOs.Friend;
using Backend.Service;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MyApi.DTOs.User;
using System.Text.Json;
using LoginAPI.Models;
using Microsoft.AspNetCore.Authorization;

[ApiController]
[Route("api/[controller]")]
public class FriendRequestController : ControllerBase
{
    private readonly AppDbContext _dbContext;

    public FriendRequestController(AppDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    // Arkadaşlık isteği gönderme
    [Authorize]
    [HttpPost("send")]
    public async Task<IActionResult> SendFriendRequest([FromBody] AddFriendRequestDto request)
    {
        // JWT token'dan userId'yi al
        var userIdFromToken = User.FindFirst(ClaimTypes.NameIdentifier)?.Value
                           ?? User.FindFirst("sub")?.Value
                           ?? User.FindFirst("userId")?.Value;

        if (string.IsNullOrEmpty(userIdFromToken))
            return Unauthorized("User ID not found in token.");

        // Sender'ı bul
        var sender = await _dbContext.Users.FirstOrDefaultAsync(u => u.UserId == userIdFromToken);

        if (sender == null)
            return NotFound("Sender not found.");

        if (request.ReceiverName == sender.UserName)
            return BadRequest("Sender and receiver cannot be the same user.");

        // Receiver kullanıcısını kontrol et
        var receiver = await _dbContext.Users
            .FirstOrDefaultAsync(u => u.UserName == request.ReceiverName);

        if (receiver == null)
            return NotFound("Receiver not found.");

        // Zaten arkadaş mı kontrol et (her iki yönü de kontrol et)
        var isFriend = await _dbContext.Friends.AnyAsync(f =>
            (f.UserId1 == sender.UserId && f.UserId2 == receiver.UserId) ||
            (f.UserId1 == receiver.UserId && f.UserId2 == sender.UserId)
        );

        if (isFriend)
            return BadRequest("You are already friends with this user.");

        var existingRequest = await _dbContext.FriendRequests
            .AnyAsync(f =>
                (f.SenderName == sender.UserName && f.ReceiverName == request.ReceiverName) ||
                (f.SenderName == request.ReceiverName && f.ReceiverName == sender.UserName)
            );

        if (existingRequest)
            return BadRequest("Friend request already exists between these users.");

        // Yeni arkadaşlık isteği oluştur
        var friendRequest = new AddFriend
        {
            SenderId = sender.UserId,
            SenderName = sender.UserName,
            ReceiverName = request.ReceiverName,
            Status = "Pending",
        };

        await _dbContext.FriendRequests.AddAsync(friendRequest);
        await _dbContext.SaveChangesAsync();

        return Ok("Friend request sent.");
    }

    [Authorize]
    [HttpGet("check")]
    public async Task<IActionResult> CheckFriendRequests()
    {
        var userIdFromToken = User.FindFirst(ClaimTypes.NameIdentifier)?.Value
                                  ?? User.FindFirst("sub")?.Value
                                  ?? User.FindFirst("userId")?.Value;

        if (string.IsNullOrEmpty(userIdFromToken))
            return Unauthorized("User ID not found in token.");

        // Mevcut kullanıcıyı bul
        var currentUser = await _dbContext.Users.FirstOrDefaultAsync(u => u.UserId == userIdFromToken);

        if (currentUser == null)
            return NotFound("User not found.");

        var currentUserName = currentUser.UserName;

        // Kullanıcının gönderdiği veya aldığı tüm bekleyen istekleri getir
        var requests = await _dbContext.FriendRequests
            .Where(f =>
                (f.ReceiverName == currentUserName || f.SenderName == currentUserName) &&
                f.Status == "Pending")
            .ToListAsync();

        Console.WriteLine($"Found Requests Count: {requests.Count}");
        if (requests.Count == 0)
        {
            return Ok(new List<CheckFriendRequestDto>());
        }

        var dtoList = requests.Select(r => new CheckFriendRequestDto
        {
            OtherPersonName = r.SenderName == currentUserName ? r.ReceiverName : r.SenderName,
            senderId = r.SenderId,
            IsSentByMe = r.SenderName == currentUserName,
            RequestId = r.Id
        }).ToList();

        Console.WriteLine($"DTO LIST: {JsonSerializer.Serialize(dtoList)}");

        return Ok(dtoList);
    }


    [HttpPost("accept")]
    public async Task<IActionResult> AcceptFriendRequest([FromBody] AcceptFriendRequestDto request) // sadece sender name alıyorum.
    {
        Console.WriteLine("=== Accept Friend Request Started ===");

        if (request == null)
        {
            Console.WriteLine("ERROR: Request body null!");
            return BadRequest("Request body boş.");
        }

        Console.WriteLine($"SenderName from body: '{request.OtherPersonName}'");

        // JWT'den user id
        var userIdFromToken = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

        if (string.IsNullOrEmpty(userIdFromToken))
        {
            Console.WriteLine("ERROR: Token geçersiz!");
            return Unauthorized("Token geçersiz.");
        }

        var myId = userIdFromToken;

        // Ben
        var me = await _dbContext.Users
            .FirstOrDefaultAsync(u => u.UserId == myId);

        if (me == null)
        {
            Console.WriteLine($"ERROR: User not found with ID: {myId}");
            return NotFound("Kullanıcı bulunamadı.");
        }

        Console.WriteLine($"Current user: {me.UserName} ({me.UserId})");

        // Sender
        var sender = await _dbContext.Users
            .FirstOrDefaultAsync(u => u.UserName == request.OtherPersonName);

        if (sender == null)
        {
            Console.WriteLine($"ERROR: Sender not found with username: {request.OtherPersonName}");
            return NotFound("İsteği gönderen kullanıcı bulunamadı.");
        }

        Console.WriteLine($"Sender: {sender.UserName} ({sender.UserId})");

        if (sender.UserId == myId)
        {
            Console.WriteLine("ERROR: Cannot friend yourself!");
            return BadRequest("Kendinle arkadaş olamazsın.");
        }

        // Zaten arkadaş mı kontrolü
        bool alreadyFriends = await _dbContext.Friends.AnyAsync(f =>
            (f.UserId1 == myId && f.UserId2 == sender.UserId) ||
            (f.UserId1 == sender.UserId && f.UserId2 == myId)
        );

        if (alreadyFriends)
        {
            Console.WriteLine("ERROR: Already friends!");
            return Conflict("Bu kullanıcı zaten arkadaşın.");
        }

        var friendRequest = await _dbContext.FriendRequests
            .FirstOrDefaultAsync(fr =>
                fr.SenderName == sender.UserName &&
                fr.ReceiverName == me.UserName &&
                fr.Status == "pending");

        if (friendRequest == null)
        {
            return NotFound("Arkadaşlık isteği bulunamadı.");
        }


        Console.WriteLine($"Found friend request ID: {friendRequest.SenderId}");

        // Friend ekle
        var friendship = new Friend
        {
            UserId1 = myId,
            UserId2 = sender.UserId,
            Status = "Accepted"
        };

        await _dbContext.Friends.AddAsync(friendship);
        Console.WriteLine("Friend relationship created");

        // Friend request'i SİL (sadece bu tek kayıt)
        _dbContext.FriendRequests.Remove(friendRequest);
        Console.WriteLine($"Friend request removed (ID: {friendRequest.SenderId})");

        await _dbContext.SaveChangesAsync();

        Console.WriteLine("=== Accept Friend Request Completed ===");

        return Ok("Arkadaşlık isteği kabul edildi.");

    }
    [Authorize]
    [HttpPost("reject")]
    public async Task<IActionResult> RejectFriendRequest([FromBody] RejectFriendRequestDto request)
    {
        Console.WriteLine("=== Reject Friend Request Started ===");

        if (request == null)
        {
            Console.WriteLine("ERROR: Request body null!");
            return BadRequest("Request body boş.");
        }

        Console.WriteLine($"OtherPersonName from body: '{request.OtherPersonName}'");

        // JWT'den user id
        var userIdFromToken = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

        if (string.IsNullOrEmpty(userIdFromToken))
        {
            Console.WriteLine("ERROR: Token geçersiz!");
            return Unauthorized("Token geçersiz.");
        }

        var myId = userIdFromToken;

        // Ben
        var me = await _dbContext.Users
            .FirstOrDefaultAsync(u => u.UserId == myId);

        if (me == null)
        {
            Console.WriteLine($"ERROR: User not found with ID: {myId}");
            return NotFound("Kullanıcı bulunamadı.");
        }

        Console.WriteLine($"Current user: {me.UserName} ({me.UserId})");

        // Karşı taraf
        var otherPerson = await _dbContext.Users
            .FirstOrDefaultAsync(u => u.UserName == request.OtherPersonName);

        if (otherPerson == null)
        {
            Console.WriteLine($"ERROR: Other person not found with username: {request.OtherPersonName}");
            return NotFound("Kullanıcı bulunamadı.");
        }

        Console.WriteLine($"Other person: {otherPerson.UserName} ({otherPerson.UserId})");

        var friendRequest = await _dbContext.FriendRequests
            .FirstOrDefaultAsync(fr =>
                ((fr.SenderName == me.UserName && fr.ReceiverName == otherPerson.UserName) ||
                 (fr.SenderName == otherPerson.UserName && fr.ReceiverName == me.UserName)) &&
                fr.Status == "pending");

        if (friendRequest == null)
        {
            Console.WriteLine("ERROR: Friend request not found!");
            return NotFound("Arkadaşlık isteği bulunamadı.");
        }

        Console.WriteLine($"Found friend request - Sender: {friendRequest.SenderName}, Receiver: {friendRequest.ReceiverName}");

        // İsteği kim gönderdi bilgisini loglayalım
        bool iAmSender = friendRequest.SenderName == me.UserName;
        Console.WriteLine($"I am the sender: {iAmSender}");

        // Friend request'i SİL
        _dbContext.FriendRequests.Remove(friendRequest);
        Console.WriteLine($"Friend request removed - Sender: {friendRequest.SenderName}, Receiver: {friendRequest.ReceiverName}");

        await _dbContext.SaveChangesAsync();

        Console.WriteLine("=== Reject Friend Request Completed ===");

        // Mesajı kim iptal etti ona göre özelleştir
        string message = iAmSender
            ? "Arkadaşlık isteği geri çekildi."
            : "Arkadaşlık isteği reddedildi.";

        return Ok(new { message });
    }
}