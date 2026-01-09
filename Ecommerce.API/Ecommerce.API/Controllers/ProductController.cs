using AutoMapper;
using Ecommerce.API.Helper;
using Ecommerce.API.Models.DTO;
using Ecommerce.API.Repository;
using Microsoft.AspNetCore.Mvc;

namespace Ecommerce.API.Controllers
{

    [Route("api/[controller]")]
    [ApiController]
    public class ProductController : ControllerBase
    {
        private readonly IEcommerceRepository _Repo;
        private readonly IMapper _mapper;

        public ProductController(IEcommerceRepository ecommerceRepository, IMapper mapper)
        {
            _Repo = ecommerceRepository;
            _mapper = mapper;
        }

        [HttpGet]
        public async Task<ActionResult> getAllProducts([FromQuery] ProductParams productParams)
        {
            var products = await _Repo.getAllProducts(productParams);
            var productsToReturn = _mapper.Map<IEnumerable<ProductsToListDto>>(products);
            Response.AddPagination(products.CurrentPage, products.PageSize
           , products.TotalCount, products.TotalPages);
            return Ok(productsToReturn);
        }

        [HttpGet]
        [Route("{id}")]
        public async Task<ActionResult> getProductPerId([FromRoute] int id)
        {
            var product = await _Repo.getProductPerId(id);
            if (product != null)
            {
                var productToReturn = _mapper.Map<ProductToDetailsDto>(product);
                productToReturn.AverageRating = _Repo.GetRating(id);
                return Ok(productToReturn);
            }
            return BadRequest("coudn't find this product");

        }

        //// Search products by name
        //[HttpGet("search")]
        //public async Task<IActionResult> Search([FromQuery] ProductParams productParams)
        //{
        //    var products = await _Repo.getAllProducts(productParams);
        //    return Ok(products);
        //}

    }
}
