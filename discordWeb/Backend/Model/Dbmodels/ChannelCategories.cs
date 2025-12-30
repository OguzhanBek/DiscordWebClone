using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace LoginAPI.Models
{
    public class ChannelCategory
    {
        [Key]
        [Column("category_id")]
        public int CategoryId { get; set; }

        [Column("channel_id")]
        public int? ChannelId { get; set; }
    }
}
