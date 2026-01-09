using Microsoft.AspNetCore.Identity;

namespace Ecommerce.API.Models.Domains
{
    public class Role:IdentityRole<int>
    {
        public ICollection<UserRole> UserRoles { get; set; }

    }
}
