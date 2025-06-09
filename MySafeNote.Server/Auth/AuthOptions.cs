using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using System.Text;

namespace MySafeNote.Server.Auth
{
    public class AuthOptions
    {
        //!!!comm
        //public const string ISSUER = "AuthOptions:Issuer"; // издатель токена
        //public const string AUDIENCE = "AuthOptions:Audience"; // потребитель токена
        //public static string KEY; // ключ для шифрации

        //public static void Configure(IConfiguration configuration)
        //{
        //    KEY = configuration["AuthOptions:Key"];
        //}

        //public static SymmetricSecurityKey GetSymmetricSecurityKey() =>
        //    new SymmetricSecurityKey(Encoding.UTF8.GetBytes(KEY));
        //!!!comm
        //!!!
        public static string ISSUER { get; private set; }
        public static string AUDIENCE { get; private set; }
        public static string KEY { get; private set; }
        public static int TOKEN_LIFETIME_MINUTES { get; private set; }

        public static void Configure(IConfiguration configuration)
        {
            ISSUER = configuration["AuthOptions:Issuer"];
            AUDIENCE = configuration["AuthOptions:Audience"];
            KEY = configuration["AuthOptions:Key"];
            TOKEN_LIFETIME_MINUTES = configuration.GetValue<int>("AuthOptions:TokenLifetimeMinutes", 43200); // 30 дней по умолчанию
        }

        public static SymmetricSecurityKey GetSymmetricSecurityKey() =>
            new SymmetricSecurityKey(Encoding.UTF8.GetBytes(KEY));
        //!!!
    }
}
