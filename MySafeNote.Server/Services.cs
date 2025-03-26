using Microsoft.IdentityModel.Tokens;
using MySafeNote.Core;
using MySafeNote.Server.Auth;
using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using MySafeNote.Server.Model;
//using Microsoft.AspNetCore.Identity;

//namespace my_safe_note
namespace MySafeNote.Server
{
    public class Services
    {
        //private readonly PasswordHasher<User> _passwordHasher;

        ////public Services(PasswordHasher<User> passwordHasher);
        //public Services()
        //{
        //    _passwordHasher = new PasswordHasher<User>();
        //}


        //public string HashPassword(User user, string password)
        //{
        //    // Здесь должен быть реализован алгоритм хеширования
        //    // Для примера используем простой способ:
        //    //return Convert.ToBase64String(System.Text.Encoding.UTF8.GetBytes(password));

        //    //user.PasswordHash = _passwordHasher.HashPassword(user, password);

        //    //PasswordHasher<User> passwordHasher = new PasswordHasher<User>();
        //    //return passwordHasher.HashPassword(user, password);

        //    return _passwordHasher.HashPassword(user, password);

        //    //var v1 = passwordHasher.VerifyHashedPassword(user, s1, password);

        //    //return _passwordHasher.HashPassword(user, password);
        //}

        //public bool VerifyPassword(User user, string password)
        //{
        //    var result = _passwordHasher.VerifyHashedPassword(user, user.PasswordHash, password);
        //    return result == PasswordVerificationResult.Success;
        //}


        public static UserLoginDto CreateJwtToken(int userId, string email)
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
