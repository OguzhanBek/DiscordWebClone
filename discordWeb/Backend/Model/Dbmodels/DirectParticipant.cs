using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace LoginAPI.Models
{
    [Table("DirectParticipant")]
    public class DirectParticipant
    {
        [Key]
        [Column("id")]
        public string Id { get; set; } = Guid.NewGuid().ToString(); // ✅ Default değer

        [Column("conversation_id")]
        public string ConversationId { get; set; } = null!;

        [Required]
        [Column("user_id")]
        public string UserId { get; set; } = null!;

        [Column("joined_at")]
        public DateTime JoinedAt { get; set; } = DateTime.UtcNow; // ✅ Default değer
    }
}
