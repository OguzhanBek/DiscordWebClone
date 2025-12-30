using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace LoginAPI.Models
{
    public class UserSetting
    {
        [Key]
        [Column("user_id")]
        public int UserId { get; set; }

        [Required]
        [Column("theme")]
        public string Theme { get; set; } = null!;

        [Required]
        [Column("notifications")]
        public string Notifications { get; set; } = null!;
    }
}
