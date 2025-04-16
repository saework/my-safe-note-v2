using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using System.Text;

namespace MySafeNote.Server.Auth
{
    public class AuthOptions
    {
        public const string ISSUER = "AuthOptions:Issuer"; // издатель токена
        public const string AUDIENCE = "AuthOptions:Audience"; // потребитель токена
        public static string KEY; // ключ для шифрации

        public static void Configure(IConfiguration configuration)
        {
            KEY = configuration["AuthOptions:Key"];
        }

        public static SymmetricSecurityKey GetSymmetricSecurityKey() =>
            new SymmetricSecurityKey(Encoding.UTF8.GetBytes(KEY));
    }
}
