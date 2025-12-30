using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace LoginAPI.Models
{
    public class Friend
    {
        [Key]
        [Column("user_id1")]
        public string UserId1 { get; set; } =null!;

        [Required]
        [Column("user_id2")]
        public string UserId2 { get; set; } = null!;

        [Required]
        [Column("status")]
        public string Status { get; set; } = null!;
    }
}
