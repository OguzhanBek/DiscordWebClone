using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace LoginAPI.Models
{
    public class ModerationAction
    {
        [Key]
        [Column("action_id")]
        public int ActionId { get; set; }

        [Required]
        [Column("server_id")]
        public int ServerId { get; set; }

        [Required]
        [Column("user_id")]
        public int UserId { get; set; }

        [Required]
        [Column("action_type")]
        public string ActionType { get; set; } = null!;

        [Required]
        [Column("action_reason")]
        public string ActionReason { get; set; } = null!;

        [Required]
        [Column("action_time")]
        public DateTime ActionTime { get; set; }
    }
}
