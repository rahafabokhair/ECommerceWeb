using AutoMapper;
using CloudinaryDotNet;
using CloudinaryDotNet.Actions;
using Ecommerce.API.Helper;
using Ecommerce.API.Models.Domains;
using Ecommerce.API.Models.DTO;
using Ecommerce.API.Repository;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;

namespace Ecommerce.API.Controllers
{
    //[Route("api/[controller]")]
    [Route("api/product/{productId}/photos")]
    [ApiController]
    public class PhotosController : ControllerBase
    {
        private readonly IEcommerceRepository _repo;
        private readonly IMapper _mapper;
        private readonly IOptions<CloudinarySettings> _cloudinaryConfig;
        private readonly Cloudinary _cloudinary;
        public PhotosController(IEcommerceRepository repo, IMapper mapper,
              IOptions<CloudinarySettings> cloudinaryConfig)
        {
            _mapper = mapper;
            _repo = repo;
            //_cloudinaryService = cloudinaryService; 

            _cloudinaryConfig = cloudinaryConfig;
            Account acc = new Account(
                        _cloudinaryConfig.Value.CloudName,
                        _cloudinaryConfig.Value.ApiKey,
                        _cloudinaryConfig.Value.ApiSecret
                   );
            _cloudinary = new Cloudinary(acc);

        }

        [HttpGet("{id}", Name = "GetPhoto")]

        public async Task<IActionResult> getPhoto(int userId, int id)
        {

            var photoFromRepo = await _repo.GetPhoto(id);
            var photo = _mapper.Map<PhotoForReturnDto>(photoFromRepo);
            return Ok(photo);
        }

        //[HttpGet]
        //public async Task<IActionResult> getPhotosForProduct(int productId)
        //{

        //    var photosFromRepo = await _repo.getPhotosForProduct(productId);
        //    var photos = _mapper.Map<IEnumerable<PhotoForReturnDto>>(photosFromRepo);
        //    return Ok(photos);
        //}

        [HttpGet]
        public async Task<IActionResult> GetMainPhotoForProduct(int productId)
        {

            var photoFromRepo = await _repo.GetMainPhotoForProduct(productId);
            var photo = _mapper.Map<PhotoForReturnDto>(photoFromRepo);
            return Ok(photo);
        }


        [Authorize(Policy = "ModerateRole")]
        [HttpPost]
        public async Task<IActionResult> addPhotoForProduct(int productId, [FromForm] PhotoForCreationDto photoForCreationDto)
        {
            var productDomain = await _repo.getProductPerId(productId);
            // get the file from DTO
            var file = photoForCreationDto.File;

            //store the result come from cloudinary
            var uploadResult = new ImageUploadResult();
            if (file.Length > 0)
            {
                using (var stream = file.OpenReadStream())
                {
                    var uploadParams = new ImageUploadParams()
                    {
                        File = new FileDescription(file.Name, stream),
                        Transformation = new Transformation().Width(500).Height(500).Crop("fill").Gravity("face")
                    };
                    uploadResult = _cloudinary.Upload(uploadParams);
                }

            }

            photoForCreationDto.Url = uploadResult.Uri.ToString();
            photoForCreationDto.PublicId = uploadResult.PublicId;

            photoForCreationDto.Description = "default";
            var photo = _mapper.Map<Photo>(photoForCreationDto);
            if (!productDomain.Photos.Any(u => u.IsMain))
            {
                photo.IsMain = true;
            }
            productDomain.Photos.Add(photo);
            if (await _repo.SaveAll())
            {
                var photoToReturn = _mapper.Map<PhotoForReturnDto>(photo);
                // return CreatedAtRoute("GetPhoto", new {id = photo.Id}, photoToReturn);
                return CreatedAtRoute("GetPhoto", new { productId = productId, id = photo.Id }, photoToReturn);
            }
            return BadRequest("Could not add the photo");
        }

        [Authorize(Policy = "ModerateRole")]
        [HttpPost("{id}/setMain")]
        public async Task<IActionResult> setMainPhoto(int productId, [FromRoute] int id)
        {

            //return the user
            var productDomain = await _repo.getProductPerId(productId);

            if (!productDomain.Photos.Any(p => p.Id == id))
            {
                return Unauthorized();
            }
            var photoFromRepo = await _repo.GetPhoto(id);

            if (photoFromRepo.IsMain)
            {
                return BadRequest("This is already the main photo");
            }

            var currentMainPhoto = await _repo.GetMainPhotoForProduct(productId);

            if (currentMainPhoto != null)
            {
                currentMainPhoto.IsMain = false;
            }

            photoFromRepo.IsMain = true;


            if (await _repo.SaveAll())
            {
                return NoContent();
            }
            return BadRequest("Could not set photo to main");
        }

        [Authorize(Policy = "ModerateRole")]
        [HttpDelete("{id}")]
        public async Task<IActionResult> deletePhoto(int productId, [FromRoute] int id)
        {
            //return the user
            var productDomain = await _repo.getProductPerId(productId);

            if (!productDomain.Photos.Any(p => p.Id == id))
            {
                return Unauthorized();
            }

            var photoFromRepo = await _repo.GetPhoto(id);

            if (photoFromRepo.IsMain)
            {
                return BadRequest("cann't delete the main photo");
            }


            if (photoFromRepo == null)
            {
                return BadRequest();
            }

            if (photoFromRepo.PublicId != null)
            {
                //delete photo from cloudinary
                var deleteParams = new DeletionParams(photoFromRepo.PublicId);
                var result = _cloudinary.Destroy(deleteParams);
                if (result.Result == "ok")
                {
                    _repo.Delete(photoFromRepo);
                }

            }

            if (photoFromRepo.PublicId == null)
            {
                _repo.Delete(photoFromRepo);
            }
            if (await _repo.SaveAll())
            {
                return Ok();
            }
            return BadRequest("Failed to delete the photo");
        }
    }
}
