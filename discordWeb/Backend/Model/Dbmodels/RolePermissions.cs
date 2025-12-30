using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace LoginAPI.Models
{
    public class RolePermission
    {
        [Key]
        [Column("id")]
        public int Id { get; set; }

        [Required]
        [Column("role_id")]
        public int RoleId { get; set; }

        [Required]
        [Column("permission_id")]
        public int PermissionId { get; set; }

        [Required]
        [Column("granted")]
        public string Granted { get; set; } = null!;
    }
}
