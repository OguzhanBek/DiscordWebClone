using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace LoginAPI.Models
{
    public class Reaction
    {
        [Key]
        [Column("reaction_id")]
        public int ReactionId { get; set; }

        [Required]
        [Column("message_id")]
        public int MessageId { get; set; }

        [Required]
        [Column("user_id")]
        public int UserId { get; set; }

        [Required]
        [Column("emoji")]
        public string Emoji { get; set; } = null!;

        [Required]
        [Column("created_at")]
        public DateTime CreatedAt { get; set; }
    }
}
