using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Numerics;

namespace LoginAPI.Models
{
    [Table("DirectConversation")]
    public class DirectConversation

    {
        [Key]
        [Column("id")]
        public string Id { get; set; } = Guid.NewGuid().ToString();

        [Column("created_at")]
        public DateTime CreatedAt { get; set; }

    }
}