using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace FinalAssignment.DTOs.Report
{
    public class ReportResponse
    {
        public string? CategoryName { get; set; }
        public int Total { get; set; }
        public int Assigned { get; set; }
        public int Available { get; set; }
        public int NotAvailable { get; set; }
        public int WaitingForRecycling { get; set; }
        public int Recycled { get; set; }
    }
}