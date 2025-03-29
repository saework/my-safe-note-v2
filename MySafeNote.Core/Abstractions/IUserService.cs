using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using MySafeNote.Core;
using MySafeNote.Core.Dtos;

namespace MySafeNote.Core.Abstractions
{
    public interface IUserService
    {
        //Task <UserLoginDto> CreateJwtToken(int userId, string email);
        UserLoginDto CreateJwtToken(int userId, string email);
    }
}