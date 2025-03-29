using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
//using MySafeNote.Server.Model;
using Microsoft.AspNetCore.Identity;
using System.Text;
using MySafeNote.Server.Auth;
using Microsoft.IdentityModel.Tokens;
using MySafeNote.Core.Dtos;
using MySafeNote.Core.Abstractions;

namespace MySafeNote.Server.Services
{
    public class UserService : IUserService
    {
        //public static UserLoginDto CreateJwtToken(int userId, string email)
        //{
        //    var claims = new List<Claim> { new Claim(ClaimTypes.Name, email) };

        //    var jwt = new JwtSecurityToken(
        //        issuer: AuthOptions.ISSUER,
        //        audience: AuthOptions.AUDIENCE,
        //        claims: claims,
        //        expires: DateTime.UtcNow.Add(TimeSpan.FromMinutes(60)), // время жизни токена
        //        signingCredentials: new SigningCredentials(AuthOptions.GetSymmetricSecurityKey(), SecurityAlgorithms.HmacSha256));

        //    var encodedJwt = new JwtSecurityTokenHandler().WriteToken(jwt);

        //    var response = new UserLoginDto
        //    {
        //        AccessToken = encodedJwt,
        //        UserId = userId
        //    };
        //    return response;
        //}

        public UserLoginDto CreateJwtToken(int userId, string email)
        {
            var claims = new List<Claim> { new Claim(ClaimTypes.Name, email) };

            var jwt = new JwtSecurityToken(
                issuer: AuthOptions.ISSUER,
                audience: AuthOptions.AUDIENCE,
                claims: claims,
                expires: DateTime.UtcNow.Add(TimeSpan.FromMinutes(60)), // время жизни токена
                signingCredentials: new SigningCredentials(AuthOptions.GetSymmetricSecurityKey(), SecurityAlgorithms.HmacSha256));

            var encodedJwt = new JwtSecurityTokenHandler().WriteToken(jwt);

            var response = new UserLoginDto
            {
                AccessToken = encodedJwt,
                UserId = userId
            };
            return response;
        }
    }
}
