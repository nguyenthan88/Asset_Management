using Common.Enums;

namespace FinalAssignment.DTOs.Asset
{
    public class AsignedAsset
    {
        public string AssignedTo { get; set; }
        public string AssignedBy { get; set; }
        public string AssetName { get; set; }

        public DateTimeOffset AssignedDate { get; set; }
    }
}
