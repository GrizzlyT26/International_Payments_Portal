using System.Text.RegularExpressions;

namespace International_Payments_Portal.Server.Services
{
    public class InputValidator
    {
        // Whitelist patterns - only allow these formats
        private readonly Regex _ibanPattern = new(@"^[A-Z]{2}[0-9]{2}[A-Z0-9]{4,30}$");
        private readonly Regex _swiftPattern = new(@"^[A-Z]{6}[A-Z0-9]{2}([A-Z0-9]{3})?$");
        private readonly Regex _emailPattern = new(@"^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$");

        public bool IsValidIBAN(string iban)
        {
            return !string.IsNullOrWhiteSpace(iban) && _ibanPattern.IsMatch(iban.ToUpper());
        }

        public bool IsValidSWIFT(string swift)
        {
            return !string.IsNullOrWhiteSpace(swift) && _swiftPattern.IsMatch(swift.ToUpper());
        }

        public bool IsValidEmail(string email)
        {
            return !string.IsNullOrWhiteSpace(email) && _emailPattern.IsMatch(email);
        }

        public bool IsValidAmount(decimal amount)
        {
            return amount > 0 && amount <= 1000000;
        }

        public string SanitizeInput(string input)
        {
            if (string.IsNullOrWhiteSpace(input)) return string.Empty;
            // Remove dangerous characters
            return Regex.Replace(input, @"[<>'""&;]", "");
        }
    }
}
