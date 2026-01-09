namespace Ecommerce.API.Models.Domains
{
    public class Photo
    {
        public int Id { get; set; }
        public string Url { get; set; }
        public string Description { get; set; }
        public DateTime DateAdded { get; set; }
        public string PublicId { get; set; }
        public bool IsMain { get; set; }
        public Product product { get; set; }
        public int productId { get; set; }
      
    }
}
