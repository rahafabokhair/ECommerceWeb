using AutoMapper;
using Ecommerce.API.Models.Domains;
using Ecommerce.API.Models.DTO;
using Ecommerce.API.Repository;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Ecommerce.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly ITokenRepository _tokenRepository;
        private readonly UserManager<User> _userManager;
        private readonly SignInManager<User> _signInManager;
        private readonly IMapper _mapper;

        public AuthController(ITokenRepository tokenRepository,
            UserManager<User> userManager,
            SignInManager<User> signInManager,
             IMapper mapper)
        {
            _tokenRepository = tokenRepository;
            _userManager = userManager;
            _signInManager = signInManager;
            _mapper = mapper;
        }



        [HttpPost]
        [Route("Register")]
        public async Task<IActionResult> Register([FromBody] RegisterRequestDto registerRequestDto)
        {
            var userToCreate = _mapper.Map<User>(registerRequestDto);
            var result = await _userManager.CreateAsync(userToCreate,registerRequestDto.Password);

            if (result.Succeeded)
            {
                //Add roles to this User
                if (registerRequestDto.Roles != null && registerRequestDto.Roles.Any())
                {
                    await _userManager.AddToRolesAsync(userToCreate, registerRequestDto.Roles);

                    if (result.Succeeded)
                    {
                        //return Ok("User was registered! please login.");
                        return StatusCode(201);
                    }
                }
            }
            return BadRequest(result.Errors.ToList()[0].Code);
        }


        [HttpPost]
        [Route("Login")]
        public async Task<IActionResult> Login([FromBody] LoginRequestDto loginRequestDto)
        {
            var user = await _userManager.FindByNameAsync(loginRequestDto.Username);
          
            var result=await _signInManager.CheckPasswordSignInAsync(user,
                loginRequestDto.Password,false);
            if (result.Succeeded)
            {
                var appUser = await _userManager.Users.FirstOrDefaultAsync(u => u.NormalizedUserName == loginRequestDto.Username.ToUpper());
                var roles=await _userManager.GetRolesAsync(user);
                var jwtToken = _tokenRepository.CreateJWTToken(appUser,roles.ToList());
                
                //var response = new LoginResponseDto
                //{
                //    token = jwtToken,
                //};
                return Ok(new
                {
                    token = jwtToken,
                });
               // return Ok(response);
            }
            return Unauthorized();

        }
    }
}
