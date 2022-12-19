using Common.Enums;

namespace FinalAssignment.DTOs.Assignment
{
    public class GetAssignmentDetailResponse
    {
        public string AssetCode { get; set; }
        public string AssetId { get; set; }
        public string Specification { get; set; }
        public string AssignedTo { get; set; }
        public string AssignedBy { get; set; }
        public DateTimeOffset AssignedDate { get; set; }
        public AssignmentStateEnum state { get; set; }
        public string Note { get; set; }
    }

}
