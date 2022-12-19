using Microsoft.AspNetCore.Identity;
using Data.Entities;

using Common.Enums;

namespace Data.Auth
{
    public class ApplicationUser : IdentityUser
    {
        // public Guid Id {get; set;}
        public string? FirstName { get; set; }
        public string? LastName { get; set; }
        public string? FullName { get; set; }
        public string? Type { get; set; }
        public GenderEnum Gender { get; set; }
        public DateTime DateOfBirth { get; set; }
        public DateTime JoinedDate { get; set; }
        public string? StaffCode { get; set; }
        public string? Location { get; set; }
        public bool IsFirstTime { get; set; } //true
        public bool IsDeleted { get; set; } //false
        public DateTime Time {get; set;}

        public virtual List<RequestReturning> RequestReturnings { get; set; }
        public virtual ICollection<Assignment> AssignedToMe { get; set; }
        public virtual ICollection<Assignment> AssignedByMe { get; set; }
    }
}