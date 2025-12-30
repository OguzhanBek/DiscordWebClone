using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace LoginAPI.Models
{
    public class RegisterModel
    {

        [Required]
        [Column("user_name")]
        public string UserName { get; set; } = null!;

        [Required]
        [Column("email")]
        public string Email { get; set; } = null!;

        [Required]
        [Column("password_hash")]
        public string Password { get; set; } = null!;

    }
}
