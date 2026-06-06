namespace International_Payments_Portal.Server.Models
{
    public class UpdatePaymentStatusRequest
    {
        public string Status { get; set; } = string.Empty;
        public string ReviewedBy { get; set; } = string.Empty;
        public string ReviewNotes { get; set; } = string.Empty;
    }
}
