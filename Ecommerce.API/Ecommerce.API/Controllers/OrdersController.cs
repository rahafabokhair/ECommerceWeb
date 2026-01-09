using AutoMapper;
using Ecommerce.API.Models.Domains;
using Ecommerce.API.Models.DTO;
using Ecommerce.API.Repository;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace Ecommerce.API.Controllers
{
    [Authorize]
    [Route("api/user/{userId}/[controller]")]
    [ApiController]
    public class OrdersController : ControllerBase
    {
        private readonly IEcommerceRepository _repo;
        private readonly IMapper _mapper;

        public OrdersController(IEcommerceRepository ecommerceRepository, IMapper mapper)
        {
            _repo = ecommerceRepository;
            _mapper = mapper;
        }

        [HttpGet]
        public async Task<IActionResult> GetOrders()
        {
            var repoOrders = await _repo.getAllOrders();
            return Ok(_mapper.Map<IEnumerable<OrdersForReturnDto>>(repoOrders));
        }


        [HttpGet]
        [Route("{id}")]
        public async Task<IActionResult> GetOrderPerId([FromRoute] int id)
        {
            var repoOrder = await _repo.getOrderPerId(id);
            if (repoOrder != null)
            {
                return Ok(_mapper.Map<OrdersForReturnDto>(repoOrder));
            }
            return BadRequest("no order with this ID");

        }

        [HttpPost]
        public async Task<ActionResult> addOrder([FromRoute] int userId, [FromBody] OrderForCreationDto orderForCreationDto)
        {
            //ensure the userId is correct and exsist
            if (userId != int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value))
            {
                return Unauthorized();
            }

            //var userDomain = await _repo.getUserPerId(userId);
            var orderDomain = _mapper.Map<Order>(orderForCreationDto);

            orderDomain.UserId = userId;

            _repo.Add(orderDomain);
            if (await _repo.SaveAll())
            {
                return Ok(); 

            }
            return BadRequest("problem in adding new order");
        }
    }
}
