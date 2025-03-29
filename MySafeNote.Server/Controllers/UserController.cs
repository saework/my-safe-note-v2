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
using MySafeNote.Server.Services;
using Microsoft.AspNetCore.Identity;
//using MySafeNote.Server.Controllers.my_safe_note.Controllers;
//using MySafeNote.Server;
//using DocumentFormat.OpenXml.Spreadsheet;
using Microsoft.AspNetCore.Authorization;
//using  MySafeNote.Server.Controllers.Services;
using MySafeNote.Core.Dtos;
using DocumentFormat.OpenXml.Spreadsheet;

namespace MySafeNote.Server.Controllers
//namespace my_safe_note.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly ILogger<UserController> _logger;
        private readonly PasswordHasher<User> _passwordHasher;
        private readonly IUserRepository _userRepository;
        private readonly INoteRepository _noteRepository;
        private readonly INotebookRepository _notebookRepository;
        private readonly IUserService  _userService;
        public UserController(ILogger<UserController> logger, IUserRepository userRepository, INoteRepository noteRepository, INotebookRepository notebookRepository, IUserService  userService)
        {
            _logger = logger;
            _passwordHasher = new PasswordHasher<User>();
            _userRepository = userRepository;
            _noteRepository = noteRepository;
            _notebookRepository = notebookRepository;
            _userService = userService;

        }

        // GET: api/User
        [HttpGet]
        [Authorize]
        public async Task<ActionResult<List<User>>> GetUsersAsync()
        {
            var users = await _userRepository.GetAllAsync();
            return Ok(users);
        }

        // GET api/User/5
        [HttpGet("{id}")]
        [Authorize]
        public async Task<ActionResult<User>> GetUserByIdAsync(int id)
        {
            var user = await _userRepository.GetByIdAsync(id);
            if (user == null)
            {
                return NotFound($"User с ID: {id} не найден.");
            }
            return Ok(user);
        }

        // GET api/User/email/{email}
        [HttpGet("email/{email}")]
        [Authorize]
        public async Task<ActionResult<User>> GetUserByEmailAsync(string email)
        {
            var user = await _userRepository.GetUserByEmailAsync(email);
            if (user == null)
            {
                return NotFound($"User с Email: {email} не найден.");
            }
            return Ok(user);
        }

        [HttpPost("signup/")]
        //public async Task<IActionResult> CreateUserAsync(UserDto userDto)
        public async Task<IActionResult> CreateUserAsync([FromBody] UserDto userDto)
        {
            // Проверяем, что данные в данные валидны
            if (userDto == null || string.IsNullOrEmpty(userDto.Email) || string.IsNullOrEmpty(userDto.Password))
            {
                return BadRequest("Некорректные данные.");
            }
            var userExists = await _userRepository.CheckUserExistsAsync(userDto.Email.Trim());
            if (userExists)
            {
                //return NotFound($"User с Email: {userDto.Email} уже создан.");
                //return BadRequest("Пользователь с таким Email уже создан.");
                //return Ok("Пользователь с таким Email уже создан.");
                //return Unauthorized("Пользователь с таким Email уже создан.");
                return Conflict("Пользователь с таким Email уже создан.");
            }
            try
            {
                var email = userDto.Email;
                //var passwordHash = Services.HashPassword(new User { Email = userDto.Email }, userDto.Password);
                var passwordHash = _passwordHasher.HashPassword(new User { Email = userDto.Email }, userDto.Password);
                var newUser = new User { Email = userDto.Email, PasswordHash = passwordHash };
                var newUserId = await _userRepository.CreateAsync(newUser);

                //var response = Services.CreateJwtToken(newUserId, email);
                var response = _userService.CreateJwtToken(newUserId, email);
                return Ok(response);
                //return CreatedAtAction(nameof(GetUserByIdAsync), new { id = newUserId }, newUserId);
            }
            catch (ArgumentException ex)
            {
                string errMessage = ex.Message;
                _logger.LogError("Ошибка при создании пользователя. {errMessage}", errMessage);
                return BadRequest(errMessage);
            }
            catch (Exception ex)
            {
                string errMessage = $"Внутренняя ошибка сервера. {ex.Message}";
                _logger.LogError(errMessage);
                return StatusCode(500, errMessage);
            }
        }

        // PUT api/User/5
        [HttpPut("{id}")]
        [Authorize]
        public async Task<ActionResult<User>> ChangeUserByIdAsync(int id, [FromBody] UserDto changedUser)
        {
            if (changedUser is null)
            {
                return BadRequest("updatedUser пустой");
            }
            if (string.IsNullOrEmpty(changedUser.Email) || string.IsNullOrEmpty(changedUser.Password))
            {
                return BadRequest("Не определен Email или Password");
            }
            var user = await _userRepository.GetByIdAsync(id);
            if (user == null)
            {
                return BadRequest($"User с ID: {id} не найден.");
            }
            // Обновляем данные пользователя
            user.Email = changedUser.Email;
            //var passwordHash = Services.HashPassword(user, changedUser.Password);
            var passwordHash = _passwordHasher.HashPassword(user, changedUser.Password);
            
            user.PasswordHash = passwordHash;
            await _userRepository.UpdateAsync(user);
            return Ok(user);
        }

        // DELETE api/User/5
        [HttpDelete("{id}")]
        [Authorize]
        public async Task<ActionResult<int>> DeleteUserByIdAsync(int id)
        {
            var deletedId = await _userRepository.RemoveAsync(id);
            return Ok(deletedId);
        }

        // DELETE api/User/email/{email}
        [HttpDelete("email/{email}")]
        [Authorize]
        public async Task<ActionResult<int>> DeleteUserByEmailAsync(string email)
        {
            var user = await _userRepository.GetUserByEmailAsync(email);
            if (user == null)
            {
                return NotFound($"User с Email: {email} не найден.");
            }
            var deleteUserNotes = await _noteRepository.DeleteAllNotesByUserEmailAsync(email);
            _logger.LogInformation("deleteUserNotes = {deleteUserNotes}", deleteUserNotes);
            var deleteUserNotebooks = await _notebookRepository.DeleteAllNotebooksByUserEmailAsync(email);
            _logger.LogInformation("deleteUserNotebooks = {deleteUserNotebooks}", deleteUserNotebooks);
            var deletedId = await _userRepository.RemoveAsync(user.Id);
            return Ok(deletedId);
            //if (deleteUserNotes == 0 || deletedId == 0)
            //if (deletedId == 0)
            //    return Ok(0);
            //else
            //    return Ok(deletedId);
        }

        [HttpPost("login/")]
        //public async Task<IActionResult> LoginUserByEmail(UserDto userLoginData)
        public async Task<IActionResult> LoginUserByEmail([FromBody] UserDto userLoginData)
        {
            if (userLoginData == null)
            {
                return BadRequest("UserLoginData не определен.");
            }

            var email = userLoginData.Email;
            var password = userLoginData.Password;

            if (string.IsNullOrWhiteSpace(email))
            {
                return BadRequest("Email не определен.");
            }
            if (string.IsNullOrWhiteSpace(password))
            {
                return BadRequest("Password не определен.");
            }

            User user = await _userRepository.GetUserByEmailAsync(email);
            if (user == null)
            {
                return NotFound($"User с Email: {email} не найден.");
            }
            var passwordHash = user.PasswordHash;
            //var passwordHash = _passwordHasher.HashPassword(user, password);
            var passwordIsCorrect = _passwordHasher.VerifyHashedPassword(user, user.PasswordHash, password);
            //var result = _passwordHasher.VerifyHashedPassword(user, user.PasswordHash, password);
            if (passwordIsCorrect != PasswordVerificationResult.Success)
            {
                return Unauthorized("Не верный пароль.");
            }

            //var response = Services.CreateJwtToken(user.Id, email);
            var response = _userService.CreateJwtToken(user.Id, email);
            return Ok(response);
        }

    }
}

