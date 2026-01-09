using System.ComponentModel.DataAnnotations;

namespace Ecommerce.API.Models.DTO
{
    public class RegisterRequestDto
    {
        [Required]
        [DataType(DataType.EmailAddress)]
        public string Username { get; set; }
        [Required]
        [DataType(DataType.Password)]
        [StringLength(8, MinimumLength = 4, ErrorMessage = "you must specify password between 4 and 8")]
        public string Password { get; set; }
        public string[] Roles { get; set; }

        [Required]
        public string Gender { get; set; }
   
        [Required]
        public DateTime DateOfBirth { get; set; }
        [Required]
        public string City { get; set; }
        [Required]
        public string Country { get; set; }
        

    }
}
