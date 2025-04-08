using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using MySafeNote.Core;
using MySafeNote.Core.Abstractions;
//using MySafeNote.WebHost.Model;
//using MySafeNote.DataAccess.Repositories;
//using Microsoft.IdentityModel.Tokens;
//using MySafeNote.Server.Auth;
//using System.IdentityModel.Tokens.Jwt;
//using System.Security.Claims;

//using MySafeNote.Server.Model;
//using MySafeNote.Server.Services;
//using Microsoft.AspNetCore.Identity;
//using MySafeNote.Server.Controllers.my_safe_note.Controllers;
//using MySafeNote.Server;
//using DocumentFormat.OpenXml.Spreadsheet;
using Microsoft.AspNetCore.Authorization;
//using  MySafeNote.Server.Controllers.Services;
using MySafeNote.Core.Dtos;
using DocumentFormat.OpenXml.Spreadsheet;
using DocumentFormat.OpenXml.Office2010.Excel;
//using DocumentFormat.OpenXml.Spreadsheet;

namespace MySafeNote.Server.Controllers
//namespace my_safe_note.Controllers
{

    [Route("api/[controller]")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly ILogger<UserController> _logger;
        private readonly IUserService _userService;

        public UserController(ILogger<UserController> logger, IUserService userService)
        {
            _logger = logger;
            _userService = userService;
        }

        [HttpGet]
        //[Authorize]
        public async Task<ActionResult<List<User>>> GetUsersAsync()
        {
            try
            {
                var users = await _userService.GetAllUsersAsync();
                _logger.LogDebug("GetUsersAsync");
                return Ok(users);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "GetUsersAsync. Error:");
                return StatusCode(500, "Internal Server Error.");
            }
        }

        [HttpGet("{id}")]
        //[Authorize]
        public async Task<ActionResult<User>> GetUserByIdAsync(int id)
        {
            try
            {
                var user = await _userService.GetUserByIdAsync(id);
                if (user == null)
                {
                    //return NotFound($"User с ID: {id} не найден.");
                    return NotFound($"User with ID: {id} not found.");
                }
                _logger.LogDebug("GetUserByIdAsync. UserId: {userId}.", id);
                return Ok(user);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "GetUserByIdAsync. UserId: {userId}. Error:", id);
                return StatusCode(500, "Internal Server Error.");
            }
        }

        [HttpGet("email/{email}")]
        //[Authorize]
        public async Task<ActionResult<User>> GetUserByEmailAsync(string email)
        {
            try
            {
                var user = await _userService.GetUserByEmailAsync(email);
                if (user == null)
                {
                    return NotFound($"User with Email: {email} not found.");
                }
                _logger.LogDebug("GetUserByEmailAsync. Email: {email}.", email);
                return Ok(user);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "GetUserByEmailAsync. Email: {email}. Error:", email);
                return StatusCode(500, "Internal Server Error.");
            }
        }


        [HttpPut("{id}")]
        //[Authorize]
        public async Task<ActionResult<User>> ChangeUserByIdAsync(int id, [FromBody] UserDto changedUser)
        {
            _logger.LogDebug("ChangeUserByIdAsync. UserId: {id}", id);
            if (changedUser is null)
            {
                return BadRequest("changedUser data is null");
            }
            if (string.IsNullOrEmpty(changedUser.Email) || string.IsNullOrEmpty(changedUser.Password))
            {
                //return BadRequest("Не определен Email или Password");
                return BadRequest("Email or Password not found");
            }

            try
            {
                var updatedUser = await _userService.UpdateUserAsync(id, changedUser);
                _logger.LogInformation("ChangeUserByIdAsync. User changed. UserId: {id}", id);
                return Ok(updatedUser);
            }
            catch (Exception ex)
            {
                //_logger.LogError("Ошибка при обновлении пользователя. {errMessage}", ex.Message);
                //var email = changedUser?.Email.ToString() ?? "null";
                var email = changedUser?.Email ?? "null";
                _logger.LogError(ex, "ChangeUserByIdAsync. UserId: {id}, Email: {email}. Error:", id, email);
                return StatusCode(500, "Internal Server Error.");
            }
        }

        [HttpDelete("{id}")]
        //[Authorize]
        public async Task<ActionResult<int>> DeleteUserByIdAsync(int id)
        {
            try
            {
                var deletedId = await _userService.DeleteUserByIdAsync(id);
                _logger.LogInformation("DeleteUserByIdAsync. User deleted. UserId: {id}", id);
                return Ok(deletedId);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "DeleteUserByIdAsync. UserId: {id}. Error:", id);
                return StatusCode(500, "Internal Server Error.");
            }
        }

        [HttpDelete("email/{email}")]
        //[Authorize]
        public async Task<ActionResult<int>> DeleteUserByEmailAsync(string email)
        {
            try
            {
                var deletedId = await _userService.DeleteUserByEmailAsync(email);
                _logger.LogInformation("DeleteUserByEmailAsync. User deleted. Email: {email}", email);
                return Ok(deletedId);
            }
            catch (Exception ex)
            {
                //_logger.LogError("Ошибка при удалении пользователя. {errMessage}", ex.Message);
                _logger.LogError(ex, "DeleteUserByEmailAsync. Email: {email}. Error:", email);
                return StatusCode(500, "Internal Server Error.");
            }
        }

        [HttpPost("signup/")]
        public async Task<IActionResult> CreateUserAsync([FromBody] UserDto userDto)
        {
            _logger.LogDebug("CreateUserAsync. Email: {email}", userDto?.Email ?? "null");
            if (userDto == null || string.IsNullOrEmpty(userDto.Email) || string.IsNullOrEmpty(userDto.Password))
            {
                return BadRequest("Incorrect userDto data.");
            }
            try
            {
                var email = userDto.Email;
                var userExists = await _userService.GetUserByEmailAsync(userDto.Email.Trim());
                if (userExists != null)
                {

                    _logger.LogDebug("CreateUserAsync. User with this email has already been created. Email: {email}", email);
                    return Conflict("User with this email has already been created.");
                    //return Conflict("Пользователь с таким Email уже создан.");
                    
                }
                var newUserId = await _userService.CreateUserAsync(userDto);
                var response = _userService.CreateJwtToken(newUserId, userDto.Email);
                _logger.LogInformation("CreateUserAsync. User created. Email: {email}, UserId: {newUserId}", email, newUserId);
                return Ok(response);
            }
            catch (Exception ex)
            {
                //_logger.LogError("Внутренняя ошибка сервера. {errMessage}", ex.Message);
                //var email = userDto?.Email.ToString() ?? "null";
                var email = userDto?.Email ?? "null";
                _logger.LogError(ex, "CreateUserAsync. Email: {email}. Error:", email);
                return StatusCode(500, "Internal Server Error.");
            }
        }

        [HttpPost("login/")]
        public async Task<IActionResult> LoginUserByEmail([FromBody] UserDto userLoginData)
        {
            _logger.LogDebug("LoginUserByEmail. Email: {email}", userLoginData?.Email ?? "null");
            if (userLoginData == null)
            {
                return BadRequest("UserLoginData not found.");
            }
            try
            {
                var email = userLoginData.Email;
                var password = userLoginData.Password;

                if (string.IsNullOrWhiteSpace(email))
                {
                    return BadRequest("Email not found.");
                }
                if (string.IsNullOrWhiteSpace(password))
                {
                    return BadRequest("Password not found.");
                }

                var user = await _userService.GetUserByEmailAsync(email);
                if (user == null)
                {
                    return NotFound($"User with Email: {email} not found.");
                }

                if (!_userService.VerifyPassword(user, password))
                {
                    return Unauthorized("Incorrect password.");
                }
                var userId = user.Id;
                var response = _userService.CreateJwtToken(userId, email);
                //_logger.LogInformation("LoginUserByEmail. User LogIn. UserId: {userId}", userId);
                _logger.LogInformation("LoginUserByEmail. User LogIn. Email: {email}, UserId: {userId}", email, userId);

                return Ok(response);
            }
            catch (Exception ex)
            {
                //_logger.LogError("Внутренняя ошибка сервера. {errMessage}", ex.Message);
                var email = userLoginData?.Email ?? "null";
                _logger.LogError(ex, "LoginUserByEmail. Email: {email}. Error:", email);
                return StatusCode(500, "Internal Server Error.");
            }
        }
    }

}

