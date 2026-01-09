using Ecommerce.API.Repository;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Ecommerce.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class uploadFile : ControllerBase
    {
        private readonly IImageRepository _imageRepository;

        public uploadFile(IImageRepository imageRepository)
        {
            _imageRepository = imageRepository;
        }

        [HttpPost]
        [Route("Upload")]
        public async Task<IActionResult> Upload([FromForm] IFormFile file)
        {
            if (file == null || file.Length == 0)
                return BadRequest("No file uploaded");

            ValidateFileUpload(file);
            if (ModelState.IsValid)
            {

                //use repository to upload image
                var filePath = await _imageRepository.Upload(file);
                return Ok("\"" + filePath + "\"");
            }
            return BadRequest("cann't upload this file");
        }

        private void ValidateFileUpload(IFormFile file)
        {
            //validate extentions
            var allowedExtentions = new string[] { ".jpg", ".jpeg", ".png" };

            if (!allowedExtentions.Contains(Path.GetExtension(file.FileName)))
            {
                ModelState.AddModelError("file", "Unsupported file extension");
            }
            //validate the file size (if more than 10 MB)
            if (file.Length > 10485760)
            {
                ModelState.AddModelError("file", "File size more than 10MB,please upload asmaller size file");
            }

        }

    }
}

