using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace LoginAPI.Models
{
    public class ServerMember
    {
        [Key]
        [Column("member_id")]
        public int MemberId { get; set; }

        [Required]
        [Column("server_id")]
        public int ServerId { get; set; }

        [Required]
        [Column("user_id")]
        public int UserId { get; set; }

        [Required]
        [Column("joined_at")]
        public DateTime JoinedAt { get; set; }
    }
}
