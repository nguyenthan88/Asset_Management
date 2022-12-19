using FinalAssignment.DTOs.Report;
using FinalAssignment.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace FinalAssignment.Controllers
{
    [Route("api/report-management")]
    [ApiController]
    public class ReportController : ControllerBase
    {
        private readonly IReportService _reportService;
        public ReportController(IReportService reportService)
        {
            _reportService = reportService;
        }

        [HttpGet("reports")]
        public async Task<IActionResult> Report()
        {
            var result =  _reportService.Report();

            if (result == null) return StatusCode(500, "Result null");

            return Ok(result);
        }
    }
}