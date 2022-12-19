using Common.Enums;
using Data.Auth;
using Data.Entities;
using FinalAssignment.DTOs.Assignment;
using FinalAssignment.Repositories.Interfaces;
using FinalAssignment.Services.Interfaces;
using Microsoft.AspNetCore.Identity;


namespace FinalAssignment.Services.Implements
{
    public class AssignmentService : IAssignmentService
    {
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly IAssignmentRepository _assignmentRepository;
        private readonly IUserRepository _userRepository;
        private readonly IAssetRepository _assetRepository;
        public AssignmentService(IAssignmentRepository assignmentRepository, IUserRepository userRepository, IAssetRepository assetRepository, UserManager<ApplicationUser> userManager)
        {
            _assignmentRepository = assignmentRepository;
            _userRepository = userRepository;
            _assetRepository = assetRepository;
            _userManager = userManager;
        }

        public async Task<CreateAssignmentResponse> AcceptAssignment(Guid id)
        {
            using var transaction = _assignmentRepository.DatabaseTransaction();
            try
            {
                var assignment = await _assignmentRepository.GetOneAsync(x => x.Id == id);
                var asset = await _assetRepository.GetOneAsync(x => x.Id == assignment.AssetId);

                if (assignment == null)
                {
                    return new CreateAssignmentResponse
                    {
                        IsSucced = false,
                        Message = "Assignment is not exists!"
                    };
                }

                asset.AssetStatus = Common.Enums.AssetStateEnum.Assigned;
                await _assetRepository.UpdateAsync(asset);

                assignment.AssignmentState = Common.Enums.AssignmentStateEnum.Accepted;
                await _assignmentRepository.UpdateAsync(assignment);

                _assignmentRepository.SaveChanges();
                transaction.Commit();

                return new CreateAssignmentResponse
                {
                    IsSucced = true,
                    Message = "Accept Assignment Succeed"
                };
            }
            catch (Exception)
            {
                transaction.RollBack();

                return new CreateAssignmentResponse
                {
                    IsSucced = false,
                    Message = "Accept Assignment Fail"
                };
            }
        }

        public async Task<CreateAssignmentResponse> DeclineAssignment(Guid id)
        {
            using var transaction = _assignmentRepository.DatabaseTransaction();
            try
            {
                var assignment = await _assignmentRepository.GetOneAsync(x => x.Id == id);
                var asset = await _assetRepository.GetOneAsync(x => x.Id == assignment.AssetId);

                if (assignment == null)
                {
                    return new CreateAssignmentResponse
                    {
                        IsSucced = false,
                        Message = "Assignment is not exists!"
                    };
                }

                asset.AssetStatus = Common.Enums.AssetStateEnum.Available;
                await _assetRepository.UpdateAsync(asset);

                assignment.AssignmentState = Common.Enums.AssignmentStateEnum.Declined;
                await _assignmentRepository.UpdateAsync(assignment);

                _assignmentRepository.SaveChanges();
                transaction.Commit();

                return new CreateAssignmentResponse
                {
                    IsSucced = true,
                    Message = "Accept Assignment Succeed"
                };
            }
            catch (Exception)
            {
                transaction.RollBack();

                return new CreateAssignmentResponse
                {
                    IsSucced = false,
                    Message = "Accept Assignment Fail"
                };
            }
        }

        public async Task<CreateAssignmentResponse> Create(CreateAssignmentRequest assignmentRequest)
        {
            using var transaction = _assignmentRepository.DatabaseTransaction();
            try
            {
                var assetDetail = await _assetRepository.GetOneAsync(a => a.Id == assignmentRequest.AssetId);
                var localdatetime = assignmentRequest.AsssignedDate;
                var haNoiTimeZone = TimeZoneInfo.FindSystemTimeZoneById("SE Asia Standard Time");
                var singaporetime = TimeZoneInfo.ConvertTimeFromUtc(localdatetime, haNoiTimeZone);
                var newAssignment = new Assignment
                {
                    Id = Guid.NewGuid(),
                    AcceptedBy = assignmentRequest.AssignedTo,
                    AssignedTo = assignmentRequest.AssignedTo,
                    AssetCode = assignmentRequest.AssetCode,
                    AssetName = assignmentRequest.AssetName,
                    AssignedDate = singaporetime,
                    AssignmentState = 0,
                    IsDeleted = false,
                    Specification = assetDetail.Specification,
                    Note = assignmentRequest.Note,
                    AssetId = assignmentRequest.AssetId,
                    RequestBy = assignmentRequest.AssignedBy,
                    AssignedBy = assignmentRequest.AssignedBy,
                    Time = DateTime.Now,
                    location = assignmentRequest.Location
                };

                var createAssignment = await _assignmentRepository.CreateAsync(newAssignment);

                _assignmentRepository.SaveChanges();

                var asset = await _assetRepository.GetOneAsync(x => x.Id == assignmentRequest.AssetId);
                asset.AssetStatus = (Common.Enums.AssetStateEnum)1;

                await _assetRepository.UpdateAsync(asset);
                _assetRepository.SaveChanges();
                transaction.Commit();

                return new CreateAssignmentResponse
                {
                    Id = newAssignment.Id,
                    IsSucced = true,
                    Message = "Create succeed"
                };
            }
            catch (Exception)
            {
                transaction.RollBack();

                return new CreateAssignmentResponse
                {
                    IsSucced = false,
                    Message = "Create fail"
                };
            }
        }

        public async Task<IEnumerable<GetAllAssignmentResponse>> GetAll(string location)
        {
            var assignmentList = _assignmentRepository.GetAllAssignment().Where(x => x.IsDeleted == false && x.location == location).OrderByDescending(a => a.Time).Select(i => new GetAllAssignmentResponse
            {
                Id = i.Id,
                AssetCode = i.AssetCode,
                AssignedBy = i.AssignedByUser.UserName,
                AssetName = i.AssetName,
                AssignedDate = i.AssignedDate,
                AssignedTo = i.AssignedToUser.UserName,
                AssignmentState = i.AssignmentState,
                Specification = i.Asset.Specification,
                Note = i.Note
            });
            if (assignmentList == null)
            {
                return null;
            }
            return assignmentList;

        }

        public async Task<IEnumerable<GetAllAssignmentResponse>> GetAllDependUser(string userId)
        {
            var assignmentList = _assignmentRepository.GetAllAssignment().Where(x => x.IsDeleted == false &&
                                                                                    x.AssignmentState != AssignmentStateEnum.Declined &&
                                                                                    x.AssignedTo == userId &&
                                                                                    x.AssignedDate <= DateTime.UtcNow.AddHours(7))
                                                                        .OrderByDescending(a => a.Time)
            .Select(i => new GetAllAssignmentResponse
            {
                Id = i.Id,
                AssetCode = i.AssetCode,
                AssignedBy = i.AssignedByUser.UserName,
                AssetName = i.AssetName,
                AssignedDate = i.AssignedDate,
                AssignedTo = i.AssignedToUser.UserName,
                AssignmentState = i.AssignmentState,
                Specification = i.Asset.Specification,
                Note = i.Note
            });
            if (assignmentList == null)
            {
                return null;
            }
            return assignmentList;
        }

        public async Task<GetAssignmentDetailResponse> GetAssignmentDetail(string assetCode)
        {
            var assignment = await _assignmentRepository.GetOneAsync(x => x.AssetCode == assetCode);
            if (assignment == null)
            {
                return null;
            }
            var userTo = await _userManager.FindByIdAsync(assignment.AssignedTo);
            var userBy = await _userManager.FindByIdAsync(assignment.AssignedBy);
            return new GetAssignmentDetailResponse()
            {
                AssetCode = assignment.AssetCode,
                AssetId = assignment.AssetId.ToString(),
                AssignedBy = userBy.UserName,
                AssignedTo = userTo.UserName,
                Note = assignment.Note,
                Specification = assignment.Specification,
                AssignedDate = assignment.AssignedDate,
                state = assignment.AssignmentState
            };
        }

        public async Task<Assignment?> EditAssignment(EditAssignmentRequest editAssignmentRequest, Guid id)
        {
            var editAssignment = await _assignmentRepository.GetOneAsync(x => x.Id == id);

            var updateasset = await _assetRepository.GetOneAsync(x => x.Id == editAssignmentRequest.AssetId);

            var editasset1 = await _assetRepository.GetOneAsync(x => x.Id == editAssignment.AssetId);

            if (editAssignment == null)
            {
                return null;
            }

            editAssignment.Id = id;
            editAssignment.Note = editAssignmentRequest.Note;
            editAssignment.AssignedDate = editAssignmentRequest.AssignedDate;
            editAssignment.AssetId = editAssignmentRequest.AssetId;
            editAssignment.AssetCode = editAssignmentRequest.AssetCode;
            editAssignment.AssetName = editAssignmentRequest.AssetName;
            editAssignment.AssignedTo = editAssignmentRequest.AssignedTo;
            editAssignment.AssignedBy = editAssignmentRequest.AssignedBy;
            editAssignment.Time = DateTime.Now;

            await _assignmentRepository.UpdateAsync(editAssignment);

            editasset1.AssetStatus = (AssetStateEnum)0;

            updateasset.AssetStatus = (AssetStateEnum)1;

           

            await _assetRepository.UpdateAsync(editasset1);
            await _assetRepository.UpdateAsync(updateasset);
            _assignmentRepository.SaveChanges();


            return new Assignment
            {
                Id = id,
                AssetId = editAssignment.AssetId,
                AssignedTo = editAssignment.AssignedTo,
                AssignedBy = editAssignment.AssignedBy,
                AssignedDate = editAssignment.AssignedDate,
                Note = editAssignment.Note,
            };
        }

        public async Task<EditAssignmentResponse?> GetAssignmentById(Guid id)
        {
            var assignment = await _assignmentRepository.GetOneAsync(x => x.Id == id);
            if (assignment == null)
            {
                return null;
            }
            var userTo = await _userManager.FindByIdAsync(assignment.AssignedTo);
            var userBy = await _userManager.FindByIdAsync(assignment.AssignedBy);
            DateTimeOffset assignDate = assignment.AssignedDate;
            return new EditAssignmentResponse()
            {
                Id = assignment.Id,
                AssetName = assignment.AssetName,
                AssetCode = assignment.AssetCode,
                AssetId = assignment.AssetId.ToString(),
                AssignedBy = userBy.UserName,
                AssignedTo = userTo.UserName,
                AssignedById = assignment.AssignedBy,
                AssignedToId = assignment.AssignedTo,
                Note = assignment.Note,
                Specification = assignment.Specification,
                AssignedDate = assignDate.ToString("yyyy-MM-dd"),
                AssignmentState = assignment.AssignmentState
            };
        }

        public async Task<bool> DeleteAssignmentByAdmin(Guid id)
        {
            using (var transaction = _assignmentRepository.DatabaseTransaction())
            {
                try
                {
                    var checkAssignment = await _assignmentRepository.GetOneAsync(s => s.Id == id
                    && s.IsDeleted == false);
                    var asset = await _assetRepository.GetOneAsync(a => a.AssetCode == checkAssignment.AssetCode
                     && a.IsDeleted == false);

                    if (checkAssignment != null)
                    {
                        if (checkAssignment.AssignmentState == AssignmentStateEnum.WaitingForAcceptance
                        || checkAssignment.AssignmentState == AssignmentStateEnum.Declined)
                        {
                            checkAssignment.IsDeleted = true;
                            asset.AssetStatus = AssetStateEnum.Available;
                            _assignmentRepository.UpdateAsync(checkAssignment);
                            _assetRepository.UpdateAsync(asset);
                            _assignmentRepository.SaveChanges();
                            _assetRepository.SaveChanges();
                            transaction.Commit();

                            return true;
                        }

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
    }
}
