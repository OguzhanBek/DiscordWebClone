using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace LoginAPI.Models
{
    public class VoiceChannel
    {
        [Key]
        [Column("id")]
        public int Id { get; set; }

        [Required]
        [Column("channel_id")]
        public int ChannelId { get; set; }

        [Required]
        [Column("bitrate")]
        public int Bitrate { get; set; }

        [Required]
        [Column("user_limit")]
        public int UserLimit { get; set; }
    }
}
