namespace FinalAssignment.DTOs.Assignment
{
    public class EditAssignmentRequest
    {
        public Guid AssetId { get; set; }
        public string AssetCode { get; set; }
        public string AssetName { get; set; }
        public string AssignedTo { get; set; }
        public string? AssignedBy { get; set; }
        public DateTime AssignedDate { get; set; }
        public string? Note { get; set; }
    }
}
