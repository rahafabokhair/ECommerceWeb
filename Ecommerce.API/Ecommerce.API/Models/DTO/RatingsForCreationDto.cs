
namespace Ecommerce.API.Models.DTO
{
    public class RatingsForCreationDto
    {
        public int Rating { get; set; } // 1-5
        public string? Comment { get; set; }
        public int? UserId { get; set; }
        public DateTime CreatedAt { get; set; }
        public int ProductId { get; set; }
        public RatingsForCreationDto()
        {
            CreatedAt = DateTime.Now;
        }
    }
}
