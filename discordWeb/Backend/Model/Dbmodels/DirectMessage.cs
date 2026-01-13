using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace LoginAPI.Models
{
    [Table("DirectMessage")]
    public class DirectMessage
    {
        [Key]
        [Column("id")]
        public string Id { get; set; } = Guid.NewGuid().ToString(); // ✅ Default değer

        [Required]
        [Column("conversation_id")]
        public string ConversationId { get; set; } = null!;

        [Required]
        [Column("author_user_id")]
        public string AuthorUserId { get; set; } = null!;

        [Required]
        [Column("content")]
        public string Content { get; set; } = null!;

        [Required]
        [Column("created_at")]
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow; // ✅ Default değer

        [Column("edited_at")]
        public DateTime? EditedAt { get; set; }
    }
}