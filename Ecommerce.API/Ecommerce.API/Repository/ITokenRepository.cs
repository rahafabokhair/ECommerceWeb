using Ecommerce.API.Models.Domains;
using Microsoft.AspNetCore.Identity;

namespace Ecommerce.API.Repository
{
    public interface ITokenRepository
    {
        string CreateJWTToken(User user, List<string> roles);
    }
}
