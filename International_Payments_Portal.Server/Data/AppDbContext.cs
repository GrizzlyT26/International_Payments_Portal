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
    }
}