using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace LoginAPI.Models
{
    public class Notification
    {
        [Key]
        [Column("notification_id")]
        public int NotificationId { get; set; }

        [Required]
        [Column("user_id")]
        public int UserId { get; set; }

        [Required]
        [Column("message")]
        public string Message { get; set; } = null!;

        [Required]
        [Column("is_read")]
        public string IsRead { get; set; } = null!;

        [Required]
        [Column("created_at")]
        public DateTime CreatedAt { get; set; }
    }
}
