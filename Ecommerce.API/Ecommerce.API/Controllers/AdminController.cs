using AutoMapper;
using Ecommerce.API.Data;
using Ecommerce.API.Models.Domains;
using Ecommerce.API.Models.DTO;
using Ecommerce.API.Repository;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Ecommerce.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AdminController : ControllerBase
    {
        private readonly EcommerceDBContext _context;
        private readonly UserManager<User> _userManager;
        private readonly IMapper _mapper;
        private readonly IEcommerceRepository _ecommerceRepository;

        public AdminController(EcommerceDBContext ecommerceDBContext,
            UserManager<User> userManager, IMapper mapper, IEcommerceRepository ecommerceRepository)
        {
            _context = ecommerceDBContext;
            _userManager = userManager;
            _mapper = mapper;
            _ecommerceRepository = ecommerceRepository;
        }

        [Authorize(Policy = "RequireAdminRole")]
        [HttpGet("usersWithRoles")]
        public async Task<IActionResult> getUsersWithRoles()
        {
            var userList = await (from user in _context.Users
                                  orderby user.UserName
                                  select new
                                  {
                                      Id = user.Id,
                                      UserName = user.UserName,
                                      Roles = (from userRole in user.UserRoles
                                               join role in _context.Roles
                                               on userRole.RoleId equals role.Id
                                               select role.Name).ToList()
                                  }).ToListAsync();
            return Ok(userList);
        }

        [Authorize(Policy = "RequireAdminRole")]
        [HttpPost("editRoles/{userName}")]
        public async Task<IActionResult> EditRoles(string userName, RoleEditDto roleEditDto)
        {
            var user = await _userManager.FindByNameAsync(userName);
            var useRoles = await _userManager.GetRolesAsync(user);
            var selectedRoles = roleEditDto.RoleNames;
            selectedRoles = selectedRoles ?? new string[] { };
            var result = await _userManager.AddToRolesAsync(user, selectedRoles.Except(useRoles));
            if (!result.Succeeded)
            {
                return BadRequest("Failed to add to roles");

            }
            result = await _userManager.RemoveFromRolesAsync(user, useRoles.Except(selectedRoles));
            if (!result.Succeeded)
            {
                return BadRequest("Failed to remove the roles");
            }
            return Ok(await _userManager.GetRolesAsync(user));
        }


        [Authorize(Policy = "ModeratePhotoRole")]
        [HttpGet("photosForModeration")]
        public async Task<IActionResult> getPhotosForModeration()
        {
            return Ok("Admins or moderators can see this");
        }

        ////productPart

        [Authorize(Policy = "ModerateRole")]
        [HttpPost("ProductForCreation")]
        public async Task<IActionResult> ProductForCreation([FromBody] ProductForCreationDto productForCreationDto)
        {
            var productDomenToCreate = _mapper.Map<Product>(productForCreationDto);
            _ecommerceRepository.Add(productDomenToCreate);
            if (await _ecommerceRepository.SaveAll())
            {
                return Ok(productDomenToCreate);
            }
            throw new Exception("Creating the Product failed on save");
        }

        [Authorize(Policy = "ModerateRole")]
        [HttpPut("ProductForModeration/{id}")]
        public async Task<IActionResult> ProductForModeration(int id, ProductForEditDto productForEditDto)
        {
            var productDomain = await _ecommerceRepository.getProductPerId(id);


           var ed= _mapper.Map(productForEditDto, productDomain);
           
            if (await _ecommerceRepository.SaveAll())
            {
                return NoContent();

            }
            throw new Exception($"Updating product{id} failed on save");
        }

        [Authorize(Policy = "ModerateRole")]
        [HttpDelete("ProductForDelete/{id}")]
        public async Task<IActionResult> ProductForDelete(int id)
        {
            var productDomain = await _ecommerceRepository.getProductPerId(id);
            _ecommerceRepository.Delete(productDomain);
            if (await _ecommerceRepository.SaveAll())
            {
                return Ok();

            }
            throw new Exception($"Deleteing product{id} failed");
        }


        //orders

        [Authorize(Policy = "ModerateRole")]
        [HttpGet("Orders")]
        public async Task<IActionResult> GetOrders()
        {
            var repoOrders = await _ecommerceRepository.getAllOrders();
            return Ok(_mapper.Map<IEnumerable<OrdersForReturnDto>>(repoOrders));
        }


        [Authorize(Policy = "ModerateRole")]
        [HttpPut("OrderForModeration/{id}")]
        public async Task<IActionResult> OrderForModeration(int id, OrderForEditDto orderForEditDto)
        {
            var orderDomain = await _ecommerceRepository.getOrderPerId(id);

            _mapper.Map(orderForEditDto, orderDomain);
            if (await _ecommerceRepository.SaveAll())
            {
                return NoContent();

            }
            throw new Exception($"Updating order{id} failed on save");
        }
    }
}
