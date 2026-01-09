using Ecommerce.API.Repository;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Ecommerce.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CategoriesController : ControllerBase
    {
        private readonly IEcommerceRepository _repo;

        public CategoriesController(IEcommerceRepository ecommerceRepository)
        {
            _repo = ecommerceRepository;
        }

        [HttpGet]
        public async Task<IActionResult> getAllCategories()
        {
             var categories=await _repo.getAllCategories();
            return Ok(categories);
        }
    }
}
