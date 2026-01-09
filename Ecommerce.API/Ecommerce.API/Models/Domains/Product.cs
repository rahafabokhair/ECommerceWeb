using System.Text.Json.Serialization;

namespace Ecommerce.API.Models.Domains
{
    public class Product
    {
        public int Id { get; set; }
        public string name { get; set; }
        public string Price { get; set; }
        public string Description { get; set; }
        public string Brand { get; set; }
        public string specification { get; set; }
        public bool isApproved { get; set; }

        public int categoryId { get; set; }
        public Category category { get; set; }

        [JsonIgnore]
        public ICollection<Photo>? Photos { get; set; }
        public ICollection<ProductRating> Ratings { get; set; } = new List<ProductRating>();

    }
}
