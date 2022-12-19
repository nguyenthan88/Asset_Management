using System.ComponentModel.DataAnnotations;

namespace FinalAssignment.DTOs.User
{
    public class RegisterModelResponse
    {
        [Required]
        public string Email { get; set; }

        [Required]
        public string userName { get; set; }

        [Required]
        public string Password { get; set; }
    }
}