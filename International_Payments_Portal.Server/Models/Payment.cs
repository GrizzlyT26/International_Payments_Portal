namespace International_Payments_Portal.Server.Models
{
    public class Payment
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public string ReceiverIBAN { get; set; } = string.Empty;
        public string ReceiverSWIFT { get; set; } = string.Empty;
        public decimal Amount { get; set; }
        public string Currency { get; set; } = "USD";
        public string Description { get; set; } = string.Empty;
        public string Status { get; set; } = "Pending";
        public string? TransactionId { get; set; }
        public decimal? Fee { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}