using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace LoginAPI.Models
{
    public class ServerLog
    {
        [Key]
        [Column("log_id")]
        public int LogId { get; set; }

        [Required]
        [Column("server_id")]
        public int ServerId { get; set; }

        [Required]
        [Column("user_id")]
        public int UserId { get; set; }

        [Required]
        [Column("action")]
        public string Action { get; set; } = null!;

        [Required]
        [Column("timestamp")]
        public DateTime Timestamp { get; set; }
    }
}
