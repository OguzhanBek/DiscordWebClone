using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace LoginAPI.Models
{
    public class Channel
    {
        [Key]
        [Column("channel_id")]
        public int ChannelId { get; set; }

        [Required]
        [Column("server_id")]
        public int ServerId { get; set; }

        [Required]
        [Column("name")]
        public string Name { get; set; } = null!;

        [Required]
        [Column("type")]
        public string Type { get; set; } = null!;

        [Required]
        [Column("created_at")]
        public DateTime CreatedAt { get; set; }
    }
}
