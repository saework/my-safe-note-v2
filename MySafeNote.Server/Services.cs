using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace my_safe_note
{
    public class Services
    {
        public static string HashPassword(string password)
        {
            // Здесь должен быть реализован алгоритм хеширования
            // Для примера используем простой способ:
            return Convert.ToBase64String(System.Text.Encoding.UTF8.GetBytes(password));
        }
    }
}
