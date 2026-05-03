namespace International_Payments_Portal.Server.Models
{
    public class CustomerDetail
    {
        public int Id { get; set; }

        //this we must fix because we might need an id to associate a customer to their customer banking details but will discuss and fix 
        public int UserId { get; set; }

        public string AccountHolder { get; set; } = string.Empty;

        public string AccountNumber { get; set; } = string.Empty;

        public string BranchCode { get; set; } = string.Empty;

        public string AccountType { get; set; } = string.Empty;
    }
}