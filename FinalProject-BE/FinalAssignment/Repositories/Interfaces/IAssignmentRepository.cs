using Data.Entities;
using FinalAssignment.DTOs.Asset;
using TestWebAPI.Repositories.Interfaces;

namespace FinalAssignment.Repositories.Interfaces
{
    public interface IAssignmentRepository : IBaseRepository<Assignment>
    {
        Task<AsignedAsset> GetAssignedAsset(string assetCode);
        IEnumerable<Assignment> GetAllAssignment();
    }
}
