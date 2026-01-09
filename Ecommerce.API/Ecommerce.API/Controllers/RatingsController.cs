using AutoMapper;
using Ecommerce.API.Models.Domains;
using Ecommerce.API.Models.DTO;
using Ecommerce.API.Repository;
using Microsoft.AspNetCore.Mvc;

namespace Ecommerce.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class RatingsController : ControllerBase
    {

        private readonly IEcommerceRepository _repo;
        private readonly IMapper _mapper;

        public RatingsController(IEcommerceRepository ecommerceRepository, IMapper mapper)
        {
            _repo = ecommerceRepository;
            _mapper = mapper;
        }
        //[HttpGet("{productId}")]
        //public async Task<IActionResult> GetRatings(int productId)
        //{
        //    //var productRatingList = await _repo.GetRating(productId);
        //    ////_mapper.Map<IEnumerable<ProductRating>>(productRatingList);
        //    //return Ok(_mapper.Map<RatingForReturnDto>(productRatingList));

        //    var productRatingAverage = await _repo.GetRating(productId);
        //    return Ok(productRatingAverage);
        //}



        [HttpPost]
        public async Task<IActionResult> AddRatings([FromBody] RatingsForCreationDto ratingsForCreationDto)
        {

            if (ratingsForCreationDto.Rating < 1 || ratingsForCreationDto.Rating > 5)
            {
                return BadRequest("Rating must be between 1 and 5.");
            }

            var ratingToCreate= _mapper.Map<ProductRating>(ratingsForCreationDto);
            _repo.Add(ratingToCreate);

            if (await _repo.SaveAll())
            {
                return Ok();
            }
            return BadRequest("problem in adding new order");
        }

    }
}
