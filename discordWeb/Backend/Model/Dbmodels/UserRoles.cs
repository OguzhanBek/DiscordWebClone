using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace LoginAPI.Models
{
    public class UserRole
    {
        [Key]
        [Column("id")]
        public int Id { get; set; }

        [Required]
        [Column("user_id")]
        public int UserId { get; set; }

        [Required]
        [Column("role_id")]
        public int RoleId { get; set; }

        [Required]
        [Column("created_at")]
        public DateTime CreatedAt { get; set; }
    }
}
