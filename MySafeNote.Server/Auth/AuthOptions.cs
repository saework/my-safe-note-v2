using Microsoft.IdentityModel.Tokens;
using System.Text;

namespace MySafeNote.Server.Auth
{
    public class AuthOptions
    {   
        // TODO перед запуском в prod - поменять коды и убрать и ГИТ !!!

        public const string ISSUER = "MyAuthServer"; // издатель токена
        public const string AUDIENCE = "MyAuthClient"; // потребитель токена
        const string KEY = "mysupersecret_secretsecretsecretkey!123";   // ключ для шифрации
        public static SymmetricSecurityKey GetSymmetricSecurityKey() =>
            new SymmetricSecurityKey(Encoding.UTF8.GetBytes(KEY));
    }
}
