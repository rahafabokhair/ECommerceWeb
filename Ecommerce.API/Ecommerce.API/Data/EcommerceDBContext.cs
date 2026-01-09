using Ecommerce.API.Models.Domains;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace Ecommerce.API.Data
{
    public class EcommerceDBContext :
        IdentityDbContext<User, Role, int,
        IdentityUserClaim<int>, UserRole
        , IdentityUserLogin<int>, IdentityRoleClaim<int>
        , IdentityUserToken<int>>
    {
        public EcommerceDBContext(DbContextOptions<EcommerceDBContext> dbContextOptions) : base(dbContextOptions)
        {

        }
        public DbSet<User> Users { get; set; }
        public DbSet<Product> Products { get; set; }
        public DbSet<Photo> Photos { get; set; }
        public DbSet<Category> categories { get; set; }
        public DbSet<Order> Orders { get; set; }
        public DbSet<OrderStatus> OrderStatuses { get; set; }
        public DbSet<ProductRating> ProductRatings { get; set; }


        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);

            builder.Entity<UserRole>(userRole =>
            {
                userRole.HasKey(ur => new { ur.UserId, ur.RoleId });
               
                userRole.HasOne(ur => ur.Role)
                .WithMany(r => r.UserRoles)
                .HasForeignKey(ur => ur.RoleId)
                .IsRequired();
               
                userRole.HasOne(ur => ur.User)
               .WithMany(r => r.UserRoles)
               .HasForeignKey(ur => ur.UserId)
               .IsRequired();
            });

        }
    }
}