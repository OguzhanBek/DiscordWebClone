using System.ComponentModel.DataAnnotations;

namespace LoginAPI.Models
{
            public class DbUser
            {
                        [Key]
                        public int user_id { get; set; }
                        public string? email { get; set; }
                        public string? password_hash { get; set; }
                        public string? user_name { get; set; }
                        public DateTime created_at { get; set; } = DateTime.UtcNow;

            }
}