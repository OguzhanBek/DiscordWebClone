namespace MyApi.DTOs.User
{
    public class CheckFriendRequestDto
    {
        public string OtherPersonName { get; set; } = null!;

        public bool IsSentByMe { get; set; }

        public int RequestId { get; set; }
        public string senderId { get; set; } = null!;
    }
}