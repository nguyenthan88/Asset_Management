using Common.Enums;

namespace FinalAssignment.DTOs.User
{
    public class UserResponse
    {   
        public string UserId { get; set; }
        public string FirstName {get; set;}
        public string LastName { get; set; }
        public string StaffCode {get; set;}
        public string FullName {get; set;}
        public string UserName { get; set; }
        public DateTime? JoinedDate { get; set; }
        public DateTime? DateOfBirth { get; set; }
        public string? Type { get; set; }
        public string Location { get; set; }
        public GenderEnum Gender { get; set; }
    }
}