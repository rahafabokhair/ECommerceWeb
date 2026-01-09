using Ecommerce.API.Models.Domains;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace Ecommerce.API.Repository
{
    public class TokenRepository : ITokenRepository
    {
        private readonly IConfiguration _configuration;

        public TokenRepository(IConfiguration configuration)
        {
            _configuration = configuration;
        }
        public string CreateJWTToken(User user, List<string> roles)
        {
            //create claims from roles 
            //var claims = new List<Claim>();
            //claims.Add(new Claim(ClaimTypes.Name, user.UserName));
            //claims.Add(new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()));
            var claims = new List<Claim>(){
                new Claim(ClaimTypes.NameIdentifier,user.Id.ToString()),
                new Claim (ClaimTypes.Name,user.UserName)
                };
            foreach (var role in roles)
            {
                claims.Add(new Claim(ClaimTypes.Role, role));
            }
            //Token
            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["Jwt:Key"]));
            var credentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(claims),
                Expires = DateTime.Now.AddDays(1),
                SigningCredentials = credentials
            };            var tokenHandler = new JwtSecurityTokenHandler();            var token = tokenHandler.CreateToken(tokenDescriptor);
            ////var token = new JwtSecurityToken(
            ////    _configuration["Jwt:Issuer"],
            ////    _configuration["Jwt:Audience"],
            ////    claims,
            ////    expires: DateTime.Now.AddMinutes(15),
            ////    signingCredentials: credentials);

            return tokenHandler.WriteToken(token);

            //var token = new JwtSecurityToken(
            //        _configuration["Jwt:Issuer"],
            //        _configuration["Jwt:Audience"],
            //        claims,
            //        expires: DateTime.Now.AddDays(1),
            //        signingCredentials: credentials);
            //return new JwtSecurityTokenHandler().WriteToken(token);

        }
    }
}
