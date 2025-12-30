using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace LoginAPI.Models
{
    public class ServerCategory
    {
        [Key]
        [Column("category_id")]
        public int CategoryId { get; set; }

        [Required]
        [Column("server_id")]
        public int ServerId { get; set; }

        [Required]
        [Column("name")]
        public string Name { get; set; } = null!;
    }
}
