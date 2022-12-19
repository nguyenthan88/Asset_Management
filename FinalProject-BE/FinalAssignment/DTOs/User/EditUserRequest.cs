using System.ComponentModel.DataAnnotations;
using Common.Enums;
namespace FinalAssignment.DTOs.User
{
    public class EditUserRequest
    {
        [Required]
        public string UserName {get; set;}
        public GenderEnum Gender { get; set; }
        public DateTime DateOfBirth { get; set; }
        public DateTime JoinedDate { get; set; }
        public string UserRole {get; set;}
    }
}