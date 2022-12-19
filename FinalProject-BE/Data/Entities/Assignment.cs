using Common.Enums;
using Data.Auth;

namespace Data.Entities
{
    public class Assignment
    {
        public Guid Id { get; set; }
        public Guid AssetId { get; set; }
        public string AssignedTo { get; set; }
        public DateTime AssignedDate { get; set; }
        public string AssignedBy { get; set; }
        public string AcceptedBy { get; set; }
        public string Note { get; set; }
        public AssignmentStateEnum AssignmentState { get; set; }
        public string RequestBy { get; set; }
        public string AssetCode { get; set; }
        public string AssetName { get; set; }
        public string Specification { get; set; }
        public bool IsDeleted { get; set; } //false
        public DateTime Time { get; set; }
        public string? location {get; set;}


        public virtual Asset Asset { get; set; }

        public virtual ApplicationUser AssignedToUser { get; set; }

        public virtual ApplicationUser AssignedByUser { get; set; }

        public virtual List<RequestReturning> RequestReturnings { get; set; }
    }
}