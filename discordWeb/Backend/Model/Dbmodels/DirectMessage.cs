using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Numerics;

namespace LoginAPI.Models
{
    public class DirectMessage
    {
        [Key]
        [Column("id")]
        public long Id { get; set; }

        [Required]
        [Column("conversation_id")]
        public long ConversationId { get; set; }

        [Required]
        [Column("author_user_id")]
        public long AuthorUserId { get; set; }

        [Required]
        [Column("content")]
        public string Content { get; set; } = null!;

        [Required]
        [Column("created_at")]
        public DateTime CreatedAt { get; set; }

        [Column("edited_at")]
        public DateTime? EditedAt { get; set; }
    }
}
