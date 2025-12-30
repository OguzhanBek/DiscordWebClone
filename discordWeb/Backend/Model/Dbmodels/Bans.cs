using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace LoginAPI.Models
{
    public class Ban
    {
        [Key]
        [Column("ban_id")]
        public int BanId { get; set; }

        [Column("server_id")]
        public int? ServerId { get; set; }

        [Column("user_id")]
        public int? UserId { get; set; }

        [Column("reason")]
        public string? Reason { get; set; }

        [Required]
        [Column("banned_at")]
        public DateTime BannedAt { get; set; }
    }
}
