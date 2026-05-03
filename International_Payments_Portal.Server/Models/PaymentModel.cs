namespace International_Payments_Portal.Server.Models
{
    public class PaymentRequest
    {
        public int UserId { get; set; }
        public string ReceiverIBAN { get; set; } = string.Empty;
        public string ReceiverSWIFT { get; set; } = string.Empty;
        public decimal Amount { get; set; }
        public string Currency { get; set; } = "USD";
        public string Description { get; set; } = string.Empty;
    }

    public class PaymentResponse
    {
        public bool Success { get; set; }
        public string TransactionId { get; set; } = string.Empty;
        public string Message { get; set; } = string.Empty;
        public decimal Amount { get; set; }
        public decimal Fee { get; set; }
        public DateTime TransactionDate { get; set; }
    }
}