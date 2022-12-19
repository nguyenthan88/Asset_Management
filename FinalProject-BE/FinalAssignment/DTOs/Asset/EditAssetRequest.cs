using Common.Enums;

namespace FinalAssignment.DTOs.Asset
{
    public class EditAssetRequest
    {
        public string AssetName { get; set; }
        public string Specification { get; set; }
        public DateTime InstalledDate { get; set; }
        public AssetStateEnum AssetStatus { get; set; }
    }
}
