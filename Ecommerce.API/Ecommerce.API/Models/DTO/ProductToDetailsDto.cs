using Ecommerce.API.Models.Domains;

namespace Ecommerce.API.Models.DTO
{
    public class ProductToDetailsDto
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Price { get; set; }
        public string Description { get; set; }
        public string Brand { get; set; }
        public string specification { get; set; }
        public string PhotoURL { get; set; }
        public double AverageRating { get; set; } = 0;


        //public int? UserRating { get; set; }
        public ICollection<Photo> Photos { get; set; }
    }
}
