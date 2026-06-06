using Microsoft.EntityFrameworkCore;
using International_Payments_Portal.Server.Models;

namespace International_Payments_Portal.Server.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options)
            : base(options) { }
        public DbSet<User> Users { get; set; }

        public DbSet<Payment> Payments { get; set; }

        //new test if it doesnt break 
        public DbSet<CustomerDetail> CustomerDetails { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Payment>(entity =>
            {
                entity.Property(payment => payment.Amount).HasPrecision(18, 2);
                entity.Property(payment => payment.Fee).HasPrecision(18, 2);
                entity.Property(payment => payment.ReviewedBy).HasMaxLength(255);
                entity.Property(payment => payment.ReviewNotes).HasMaxLength(500);
            });
        }
    }
}
