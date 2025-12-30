using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

public class AddFriend
{
            [Key]
            [Column("id")]
            public int Id { get; set; }  // ← YENİ: Her kayıt benzersiz

            [Column("sender_id")]
            public string SenderId { get; set; } = null!;
            [Column("reciever_name")]
            public string ReceiverName { get; set; } = null!;
            [Column("sender_name")]
            public string SenderName { get; set; } = null!;
            [Column("status")]
            public string Status { get; set; } = null!;
}