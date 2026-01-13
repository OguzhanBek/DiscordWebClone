using System.Security.Claims;
using Backend.Service;
using LoginAPI.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

[ApiController]
[Route("api/[controller]")]
public class FriendController : ControllerBase
{
    private readonly AppDbContext _dbContext;

    public FriendController(AppDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    [Authorize]
    [HttpGet("list")]
    public async Task<IActionResult> GetFriendList()
    {
        // JWT token'dan userId'yi al
        var userIdFromToken = User.FindFirst(ClaimTypes.NameIdentifier)?.Value
                           ?? User.FindFirst("sub")?.Value
                           ?? User.FindFirst("userId")?.Value;

        if (string.IsNullOrEmpty(userIdFromToken))
            return Unauthorized("User ID not found in token.");

        Console.WriteLine($"User ID: {userIdFromToken}");

        // Friends tablosundan arkadaş ID'leri
        var friendIds = await _dbContext.Friends
            .Where(f => f.UserId1 == userIdFromToken || f.UserId2 == userIdFromToken)
            .Select(f => f.UserId1 == userIdFromToken ? f.UserId2 : f.UserId1)
            .ToListAsync();

        Console.WriteLine($"Friend IDs Count: {friendIds.Count}");
        foreach (var id in friendIds)
        {
            Console.WriteLine($"Friend ID: {id}");
        }

        if (!friendIds.Any())
            return Ok(new List<object>());

        // Users tablosundan arkadaş bilgileri
        var friends = await _dbContext.Users
            .Where(u => friendIds.Contains(u.UserId))
            .Select(u => new
            {
                friendId = u.UserId,
                u.UserName,
                u.Email,
            })
            .ToListAsync();

        Console.WriteLine($"Friends Count: {friends.Count}");
        foreach (var friend in friends)
        {
            Console.WriteLine($"Friend: {friend.UserName} - {friend.Email}");
        }

        return Ok(friends);
    }
}
