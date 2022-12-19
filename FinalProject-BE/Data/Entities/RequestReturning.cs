using Common.Enums;
using Data.Auth;
using Microsoft.AspNetCore.Identity;

namespace Data.Entities
{
    public class RequestReturning
    {
        public Guid Id { get; set; }
        public string? UserId { get; set; }
        public Guid? AssignmentId { get; set; }

        public string? ReturnDate { get; set; }
        public RequestStateEnum RequestStatus { get; set; }
        public DateTime Time { get; set; }


        public virtual ApplicationUser? ApplicationUser { get; set; }

        public virtual Assignment? Assignment { get; set; }
    }
}