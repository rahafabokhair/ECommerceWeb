using Ecommerce.API.Models.Domains;

namespace Ecommerce.API.Models.DTO
{
    public class ProductsToListDto
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Price { get; set; }
        public bool isApproved { get; set; }
        public string Description { get; set; }
        public string Brand { get; set; }
        public string specification { get; set; }
        public string PhotoURL { get; set; }
        public int categoryId { get; set; }
        public ICollection<Photo> Photos { get; set; }
    }
}
