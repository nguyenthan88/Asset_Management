using Common.Enums;
using Data.Entities;
using FinalAssignment.DTOs.Request;
using FinalAssignment.Repositories.Interfaces;
using FinalAssignment.Services.Interfaces;

namespace FinalAssignment.Services.Implements
{
    public class RequestReturningService : IRequestReturningService
    {
        private readonly IRequestReturningRepository _requestReturningRepository;
        private readonly IAssignmentRepository _assignmentRepository;
        private readonly IUserRepository _user;
        private readonly IAssetRepository _assetRepository;

        public RequestReturningService(IAssignmentRepository assignmentRepository, IUserRepository user,
            IAssetRepository asset, IRequestReturningRepository requestReturningRepository)
        {
            _requestReturningRepository = requestReturningRepository;
            _assignmentRepository = assignmentRepository;
            _assetRepository = asset;
            _user = user;
        }

        public async Task<bool> CancelRequest(Guid reqId)
        {
            using (var transaction = _requestReturningRepository.DatabaseTransaction())
            {
                try
                {
                    var getRequest =  _requestReturningRepository.GetOneRequest(s => s.Id == reqId
                    && s.RequestStatus == RequestStateEnum.WaitingForReturning);
                    if (getRequest != null)
                    {
                        //getRequest.Assignment.Asset.AssetStatus = AssetStateEnum.Available; 
                        getRequest.Assignment.AssignmentState = AssignmentStateEnum.Accepted;
                        _requestReturningRepository.UpdateAsync(getRequest);
                        _requestReturningRepository.DeleteAsync(getRequest);
                        _requestReturningRepository.SaveChanges();
                        transaction.Commit();

                        return true;
                    }

                    return false;
                }
                catch
                {
                    transaction.RollBack();
                    
                    return false;
                }
            }
        }

        public async Task<bool> CompleteRequest(Guid id)
        {
            using (var transaction = _requestReturningRepository.DatabaseTransaction())
            {
                try
                {

                    var getRequest = _requestReturningRepository.GetOneRequest(i => i.Id == id && i.RequestStatus == RequestStateEnum.WaitingForReturning);


                    if (getRequest != null)
                    {
                        getRequest.RequestStatus = RequestStateEnum.Completed;
                        getRequest.ReturnDate = DateTime.Now.ToString("yyyy-MM-dd");
                        getRequest.Assignment.IsDeleted = true;
                        getRequest.Assignment.Asset.AssetStatus = AssetStateEnum.Available;

                        _requestReturningRepository.UpdateAsync(getRequest);
                        _assetRepository.SaveChanges();
                        transaction.Commit();

                        return true;
                    }

                    return false;
                }
                catch
                {
                    transaction.RollBack();
                    return false;
                }
            }
        }

        public async Task<CreateRequestReturningResponse> CreateRequestForReturning(CreateRequestReturningRequest model)
        {
            using var transaction = _requestReturningRepository.DatabaseTransaction();
            try
            {
                var assignment = await _assignmentRepository.GetOneAsync(x => x.Id == model.AssignmentId);
                if (assignment != null)
                {
                    assignment.AssignmentState = AssignmentStateEnum.WaitingForReturning;

                    var newRequest = new RequestReturning
                    {
                        Id = Guid.NewGuid(),
                        UserId = model.UserId,
                        AssignmentId = model.AssignmentId,
                        ReturnDate = null,
                        RequestStatus = RequestStateEnum.WaitingForReturning,
                        Time = DateTime.Now,
                    };

                    await _requestReturningRepository.CreateAsync(newRequest);

                    _requestReturningRepository.SaveChanges();
                    transaction.Commit();

                    return new CreateRequestReturningResponse
                    {
                        Status = "Success",
                        Message = "User created request for returning success!",
                    };

                }
                return null;
            }
            catch (Exception)
            {
                transaction.RollBack();

                return new CreateRequestReturningResponse
                {
                    Status = "Error",
                    Message = "User created request for returning fail!",
                };
            }
        }

        public async Task<IEnumerable<ReturningRequest>> GetAllReturningRequest()
        {
            var getRequest = _requestReturningRepository.GetAllRequest().OrderBy(a => a.Assignment.AssetCode).OrderByDescending(a=> a.Time).Select(i => new ReturningRequest()
                {
                    Id = i.Id,
                    AssetCode = i.Assignment.AssetCode,
                    AssetName = i.Assignment.AssetName,
                    AcceptedBy = i.Assignment.AssignedToUser.UserName,
                    AssignedDate = i.Assignment.AssignedDate,
                    RequestBy = i.ApplicationUser.UserName,
                    ReturnDate = i.ReturnDate,
                    RequestStatus = i.RequestStatus,
                    Time = i.Time,
                });
            if (getRequest == null)
            {
                return null;
            }

            return getRequest;

        }
    }
}