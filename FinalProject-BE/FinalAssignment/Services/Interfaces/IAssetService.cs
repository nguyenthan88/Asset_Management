using Data.Entities;
using FinalAssignment.DTOs.Asset;

namespace FinalAssignment.Services.Interfaces
{
    public interface IAssetService
    {
        Task<Asset?> Create(AssetRequest assetRequest);
        Task<Asset> GetAssetByName(string assetName);
        Task<EditAssetResponse> EditAsset(EditAssetRequest asset, string assetCode);
        Task<bool> DeleteAsset(string assetCode);
        Task<bool> CheckAsset(string assetCode);

        Task<IEnumerable<Asset>> GetAllAsset(string location);
        Task<IEnumerable<AssetResponse>> GetAllAssetByStatus(string location);
        Task<AssetDetail> GetDetailAsset(string assetCode);
        Task<DetailAsset> GetAssignedAsset(string assetCode);
        Task<EditAssetResponse> GetEditAsset(string assetCode);
        Task<DetailAsset> GetOneAssetInclude(string assetCode);
    }
}
