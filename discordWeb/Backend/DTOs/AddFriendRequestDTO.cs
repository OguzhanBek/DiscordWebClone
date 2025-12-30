namespace Backend.DTOs.Friend
{
    public class AddFriendRequestDto
    {
        public string SenderId { get; set; } = null!;
        public string ReceiverName { get; set; } = null!;
    }
}