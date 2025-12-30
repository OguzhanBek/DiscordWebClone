using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace LoginAPI.Models
{
    public class VoiceParticipant
    {
        [Key]
        [Column("participiant_id")]
        public int ParticipantId { get; set; }

        [Required]
        [Column("channel_id")]
        public int ChannelId { get; set; }

        [Required]
        [Column("user_id")]
        public int UserId { get; set; }

        [Required]
        [Column("joined_at")]
        public DateTime JoinedAt { get; set; }
    }
}
