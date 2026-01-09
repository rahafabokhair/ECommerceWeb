using Microsoft.AspNetCore.Identity;

namespace Ecommerce.API.Models.Domains
{
    public class UserRole:IdentityUserRole<int>
    {
        public User User { get; set; }
        public Role Role { get; set; }

    }
}
