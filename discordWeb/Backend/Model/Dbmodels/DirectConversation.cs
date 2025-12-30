using System.ComponentModel.DataAnnotations;
using System.Numerics;

namespace LoginAPI.Models
{
    public class DirectConversation

    {
        [Key]
        public long Id {get;set;}
        public DateTime CreatedAt { get; set; }

    }
}