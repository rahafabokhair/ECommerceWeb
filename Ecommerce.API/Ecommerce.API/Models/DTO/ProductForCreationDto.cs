using Ecommerce.API.Models.Domains;

namespace Ecommerce.API.Models.DTO
{
    public class ProductForCreationDto
    {

       
        public string Name { get; set; }
        public string Price { get; set; }
        public string Description { get; set; }
        public string Brand { get; set; }
        public string specification { get; set; }
        //public string PhotoURL { get; set; }
        public bool isApproved { get; set; }
        public int categoryId { get; set; }

    }
}
