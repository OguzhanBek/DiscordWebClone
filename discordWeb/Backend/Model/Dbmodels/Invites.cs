using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace LoginAPI.Models
{
    public class Invite
    {
        [Key]
        [Column("invite_id")]
        public int InviteId { get; set; }

        [Required]
        [Column("server_id")]
        public int ServerId { get; set; }

        [Required]
        [Column("code")]
        public string Code { get; set; } = null!;

        [Required]
        [Column("expires_at")]
        public DateTime ExpiresAt { get; set; }
    }
}
