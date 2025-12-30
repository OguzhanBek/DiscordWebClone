using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace LoginAPI.Models
{
    public class ServerSetting
    {
        [Key]
        [Column("id")]
        public int Id { get; set; }

        [Required]
        [Column("server_id")]
        public int ServerId { get; set; }

        [Required]
        [Column("setting_name")]
        public string SettingName { get; set; } = null!;

        [Required]
        [Column("setting_value")]
        public string SettingValue { get; set; } = null!;
    }
}
