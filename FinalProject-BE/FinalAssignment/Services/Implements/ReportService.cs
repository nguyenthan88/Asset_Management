using FinalAssignment.DTOs.Report;
using FinalAssignment.Repositories.Interfaces;
using FinalAssignment.Services.Interfaces;

namespace FinalAssignment.Services.Implements
{
    public class ReportService : IReportService
    {
        private readonly ICategoryRepository _categoryRepository;
        private readonly IAssetRepository _assetRepository;

        public ReportService(ICategoryRepository categoryRepository,IAssetRepository assetRepository)
        {
            _categoryRepository = categoryRepository;
            _assetRepository = assetRepository;
        }

        public IEnumerable<ReportResponse> Report()
        {
            var assetList = _categoryRepository.GetAllCategoryInclude().Where(x => x.IsDeleted == false).Select(i => new ReportResponse
            {
                CategoryName = i.CategoryName,
                Total = i.Assets.Where(x => x.IsDeleted == false).Count(),
                Assigned = i.Assets.Where(x => x.IsDeleted == false && x.AssetStatus == Common.Enums.AssetStateEnum.Assigned).Count(),
                Available = i.Assets.Where(x => x.IsDeleted == false && x.AssetStatus == Common.Enums.AssetStateEnum.Available).Count(),
                NotAvailable = i.Assets.Where(x => x.IsDeleted == false && x.AssetStatus == Common.Enums.AssetStateEnum.NotAvailable).Count(),
                WaitingForRecycling = i.Assets.Where(x => x.IsDeleted == false && x.AssetStatus == Common.Enums.AssetStateEnum.WaitingForRecycling).Count(),
                Recycled = i.Assets.Where(x => x.IsDeleted == false && x.AssetStatus == Common.Enums.AssetStateEnum.Recycled).Count(),
            });
            if (assetList == null)
            {
                return null;
            }
            return assetList;
        }
    }
}