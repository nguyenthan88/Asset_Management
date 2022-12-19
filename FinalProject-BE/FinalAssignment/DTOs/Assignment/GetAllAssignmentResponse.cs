using Common.Enums;
using FinalAssignment.DTOs.Base;

namespace FinalAssignment.DTOs.Assignment
{
    public class GetAllAssignmentResponse 
    {
        public Guid Id { get; set; }
        public string AssetCode { get; set; }
        public string AssetName { get; set; }
        public string AssignedTo { get; set; }
        public string AssignedBy { get; set; }
        public DateTime AssignedDate { get; set; }
        public AssignmentStateEnum AssignmentState { get; set; }
        public string Specification { get; set; }
        public string Note { get; set; }
    }
}
