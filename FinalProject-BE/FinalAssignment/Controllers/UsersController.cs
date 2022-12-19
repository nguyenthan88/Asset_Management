using FinalAssignment.DTOs.User;
using FinalAssignment.Services.Interfaces;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Mvc;

namespace FinalAssignment.Controllers
{
    [ApiController]
    // [Authorize(Roles = UserRoles.Admin)]
    [EnableCors("MyCors")]
    [Route("api/user-management")]
    public class UsersController : ControllerBase
    {
        private readonly ILoggerManager _logger;
        private readonly IUserService _userService;
        public UsersController(IUserService userService, ILoggerManager logger)
        {
            _userService = userService;
            _logger = logger;
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginRequest model)
        {
            var data = await _userService.Login(model);

            return Ok(data);
        }

        [HttpPost("register")]
        public async Task<IActionResult> CreateUser([FromBody] RegisterModelRequest model)
        {
            try
            {
                var data = await _userService.Register(model);

                return Ok(data);
            }
            catch (Exception ex)
            {
                return StatusCode(400, ex.Message);
            }
        }

        [HttpPost("reset-password")]
        public async Task<IActionResult> ResetPassword([FromBody] ResetPasswordRequest model)
        {
            var data = await _userService.ResetPassword(model);

            return Ok(data);
        }

        [HttpGet("{userName}")]
        public async Task<IActionResult> GetUserByUsername(string userName)
        {
            var data = await _userService.GetUserByUsername(userName);

            return Ok(data);
        }

        [HttpPut]
        public async Task<IActionResult> EditUser([FromBody] EditUserRequest model)
        {
            var data = await _userService.EditUser(model);

            return Ok(data);
        }

        [HttpDelete("{userName}")]
        public async Task<IActionResult> DeleteUser(string userName)
        {
            var data = await _userService.DeleteUser(userName);

            if (data.Status.Equals("Error1"))
                return StatusCode(500, data);

            if (data.Status.Equals("Error2"))
                return StatusCode(500, data);

            return Ok(data);
        }
        
        [HttpPost("{userName}")]
        public async Task<IActionResult> CheckValidUser(string userName)
        {
            var data = await _userService.CheckValidUser(userName);

            if (data.Status.Equals("Error1"))
                return StatusCode(500, data);

            if (data.Status.Equals("Error2"))
                return StatusCode(500, data);

            return Ok(data);
        }


        [HttpGet]
        public async Task<IActionResult> GetAllUserDependLocation(string userName)
        {
            var data = await _userService.GetAllUserDependLocation(userName);

            return Ok(data);
        }
    }
}
