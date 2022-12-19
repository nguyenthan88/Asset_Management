using Common.Enums;

namespace FinalAssignment.DTOs.Assignment
{
    public class EditAssignmentResponse
    {
        public Guid Id { get; set; }
        public string AssetId { get; set; }
        public string AssetCode { get; set; }
        public string AssetName { get; set; }
        public string AssignedTo { get; set; }
        public string? AssignedBy { get; set; }
        public string AssignedToId { get; set; }
        public string? AssignedById { get; set; }
        public string AssignedDate { get; set; }
        public AssignmentStateEnum AssignmentState { get; set; }
        public string Specification { get; set; }
        public string Note { get; set; }
    }
}
