using Common.Enums;
using Data.Auth;

namespace FinalAssignment.DTOs.Request
{
    public class CreateRequestReturningResponse
    {
        public string? Status { get; set; }
        public string? Message { get; set; }

        // public virtual ApplicationUser? ApplicationUser { get; set; }

        // public virtual Assignment? Assignment { get; set; }
    }
}