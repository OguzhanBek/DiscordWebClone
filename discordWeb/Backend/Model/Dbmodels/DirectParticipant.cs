using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Numerics;

namespace LoginAPI.Models
{
    public class DirectParticipant
    {
        [Key]
        [Column("conversation_id")]
        public int ConversationId { get; set; }

        [Required]
        [Column("user_id")]
        public long UserId { get; set; }

        [Required]
        [Column("joined_at")]
        public DateTime JoinedAt { get; set; }
    }
}
