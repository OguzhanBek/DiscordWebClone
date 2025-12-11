using Microsoft.EntityFrameworkCore;
using LoginAPI.Models;

namespace Backend.Service
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options)
            : base(options)
        { }

        public DbSet<DbUser> Users { get; set; }
    }
}
