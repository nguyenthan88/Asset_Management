using FinalAssignment.DTOs.Report;

namespace FinalAssignment.Services.Interfaces
{
    public interface IReportService
    {
        IEnumerable<ReportResponse> Report();
    }
}