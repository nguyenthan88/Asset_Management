using Common.Enums;

namespace FinalAssignment.DTOs.Assignment
{
    public class CreateAssignmentRequest
    {
        public Guid AssetId { get; set; }
        public string AssetCode { get; set; }
        public string AssetName { get; set; }
        public string AssignedTo { get; set; }
        public string AssignedBy { get; set; }
        public DateTime AsssignedDate { get; set; }
        public string Note { get; set; }
        public string Location {get; set;}
    }
}
