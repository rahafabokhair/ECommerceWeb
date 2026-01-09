namespace Ecommerce.API.Models.Domains
{
    public class ProductRating
    {
        public int Id { get; set; }
      
        public int? UserId { get; set; } // optional for per-user rating
        public int Rating { get; set; } // 1-5
        public string? Comment { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public int ProductId { get; set; }
       // public Product Product { get; set; }

    }
}
