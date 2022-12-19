using System.ComponentModel.DataAnnotations;

namespace Data.Auth
{
    public class RegisterModel
    {
        [Required(ErrorMessage = "User Name is required")]
        [MaxLength(50)]
        public string? Username { get; set; }

        [EmailAddress]
        [Required(ErrorMessage = "Email is required")]
        public string? Email { get; set; }

        [Required(ErrorMessage = "Password is required")]
        public string? Password { get; set; }
    }
}