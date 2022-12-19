using Common.Enums;

namespace FinalAssignment.DTOs.Asset
{
    public class AssetResponse
    {
        public Guid AssetId { get; set; }
        public string? AssetCode { get; set; }
        public string? AssetName { get; set; }
        public string? CategoryName { get; set; }
        public AssetStateEnum AssetStatus { get; set; }
    }
}