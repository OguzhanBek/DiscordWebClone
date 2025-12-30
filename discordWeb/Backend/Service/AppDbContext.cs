using Microsoft.EntityFrameworkCore;
using LoginAPI.Models;

namespace Backend.Service
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options)
            : base(options)
        { }
        public DbSet<AddFriend> FriendRequests { get; set; }
        public DbSet<Ban> Bans { get; set; }
        public DbSet<ChannelCategory> ChannelCategories { get; set; }
        public DbSet<Channel> Channels { get; set; }
        public DbSet<DirectConversation> DirectConversations { get; set; }
        public DbSet<DirectMessage> DirectMessages { get; set; }
        public DbSet<DirectParticipant> DirectParticipants { get; set; }
        public DbSet<Friend> Friends { get; set; }
        public DbSet<Invite> Invites { get; set; }
        public DbSet<Message> Messages { get; set; }
        public DbSet<ModerationAction> ModerationActions { get; set; }
        public DbSet<Notification> Notifications { get; set; }
        public DbSet<Permission> Permissions { get; set; }
        public DbSet<PrivateMessage> PrivateMessages { get; set; }
        public DbSet<Reaction> Reactions { get; set; }
        public DbSet<RolePermission> RolePermissions { get; set; }
        public DbSet<Role> Roles { get; set; }
        public DbSet<ServerCategory> ServerCategories { get; set; }
        public DbSet<ServerLog> ServerLogs { get; set; }
        public DbSet<ServerMember> ServerMembers { get; set; }
        public DbSet<Server> Servers { get; set; }
        public DbSet<ServerSetting> ServerSettings { get; set; }
        public DbSet<UserRole> UserRoles { get; set; }
        public DbSet<User> Users { get; set; }
        public DbSet<UserSetting> UserSettings { get; set; }
        public DbSet<VoiceChannel> VoiceChannels { get; set; }
        public DbSet<VoiceParticipant> VoiceParticipants { get; set; }
    }
}
