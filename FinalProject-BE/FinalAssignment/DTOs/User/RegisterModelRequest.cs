using System.ComponentModel.DataAnnotations;
using Common.Enums;
namespace FinalAssignment.DTOs.User
{
    public class RegisterModelRequest
    {
        [MinLength(1)]
        [MaxLength(20)]
        public string FirstName { get; set; }

        [Required]
        [MinLength(1)]
        [MaxLength(20)]
        public string LastName { get; set; }

        public GenderEnum Gender { get; set; }

        public DateTime DateOfBirth { get; set; }

        public DateTime JoinedDate { get; set; }

        public string? TypeStaff { get; set; }

        public string? UserRole { get; set; }

        public string? Location { get; set; }
    }
}