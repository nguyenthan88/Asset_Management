using Data.Auth;
using TestWebAPI.Repositories.Interfaces;

namespace FinalAssignment.Repositories.Interfaces
{
    public interface IUserRepository : IBaseRepository<ApplicationUser>
    {
        string getUserName(string id);
    }
}