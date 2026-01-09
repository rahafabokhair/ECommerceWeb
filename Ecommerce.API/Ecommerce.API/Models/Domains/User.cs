using Microsoft.AspNetCore.Identity;
using System.ComponentModel.DataAnnotations;

namespace Ecommerce.API.Models.Domains
{
    public class User:IdentityUser<int>
{
        public string? Gender { get; set; }  // Nullable string
        public DateTime DateOfBirth { get; set; } // Nullable DateTime
        //public string? KnownAs { get; set; }
        //public DateTime Created { get; set; } = DateTime.UtcNow; // Default value
        //public DateTime LastActive { get; set; } = DateTime.UtcNow; // Default value
        //public string? Introduction { get; set; }
        //public string? LookingFor { get; set; }
        //public string? Interests { get; set; } // Nullable to allow NULL in DB
        public string? City { get; set; }
        public string? Country { get; set; }
     
        // [JsonIgnore]
        //public ICollection<Photo>? Photos { get; set; }

        public ICollection<UserRole> UserRoles { get; set; }
        public ICollection<Order> Orders { get; set; }
    }
}
