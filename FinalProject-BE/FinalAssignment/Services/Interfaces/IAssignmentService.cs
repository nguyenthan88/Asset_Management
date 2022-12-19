using Data.Entities;
using FinalAssignment.DTOs.Assignment;

namespace FinalAssignment.Services.Interfaces
{
    public interface IAssignmentService
    {
        Task<CreateAssignmentResponse> Create (CreateAssignmentRequest assignmentRequest);

        Task<IEnumerable<GetAllAssignmentResponse>> GetAll(string location);

        Task<IEnumerable<GetAllAssignmentResponse>> GetAllDependUser(string userId);

        Task<GetAssignmentDetailResponse> GetAssignmentDetail(string assetCode);

        Task<CreateAssignmentResponse> AcceptAssignment(Guid id);
        
        Task<CreateAssignmentResponse> DeclineAssignment(Guid id);

        Task<Assignment?> EditAssignment(EditAssignmentRequest editAssignmentRequest, Guid id);

        Task<EditAssignmentResponse> GetAssignmentById(Guid id);

        Task<bool> DeleteAssignmentByAdmin(Guid id);

    }
}
