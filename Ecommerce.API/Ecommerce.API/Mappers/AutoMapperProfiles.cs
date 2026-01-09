using AutoMapper;
using Ecommerce.API.Models.Domains;
using Ecommerce.API.Models.DTO;

namespace Ecommerce.API.Mappers
{
    public class AutoMapperProfiles : Profile
    {
        public AutoMapperProfiles()
        {
            CreateMap<RegisterRequestDto, User>();
            CreateMap<Product, ProductsToListDto>().ForMember(dest => dest.PhotoURL, opt =>
            {
                opt.MapFrom(src => src.Photos.FirstOrDefault(p => p.IsMain).Url);
            });

            CreateMap<Product, ProductToDetailsDto>().ForMember(dest => dest.PhotoURL, opt =>
            {
                opt.MapFrom(src => src.Photos.FirstOrDefault(p => p.IsMain).Url);
            });
            CreateMap<Photo, PhotoForReturnDto>().ReverseMap();
            CreateMap<PhotoForCreationDto, Photo>().ReverseMap();

            CreateMap<Order, OrdersForReturnDto>().ReverseMap();
            CreateMap<OrderForCreationDto, Order>().ReverseMap();
            CreateMap<OrderForEditDto, Order>().ReverseMap();

            CreateMap<ProductForEditDto, Product>().ReverseMap();
   
            CreateMap<ProductForCreationDto, Product>().ReverseMap();
            //order
            CreateMap<RatingsForCreationDto, ProductRating>().ReverseMap();
            CreateMap<ProductRating, RatingForReturnDto>().ReverseMap();
        }
    }
}
