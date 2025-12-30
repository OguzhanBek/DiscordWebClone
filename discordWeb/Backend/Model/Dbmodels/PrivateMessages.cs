using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace LoginAPI.Models
{
    public class PrivateMessage
    {
        [Key]
        [Column("pm_id")]
        public int PmId { get; set; }

        [Required]
        [Column("sender_id")]
        public int SenderId { get; set; }

        [Required]
        [Column("reciever_id")]
        public int ReceiverId { get; set; }

        [Required]
        [Column("content")]
        public string Content { get; set; } = null!;

        [Required]
        [Column("created_at")]
        public DateTime CreatedAt { get; set; }
    }
}
