using Ecommerce.API.Helper;
using Ecommerce.API.Models.Domains;
using Ecommerce.API.Models.DTO;

namespace Ecommerce.API.Repository
{
    public interface IEcommerceRepository

    {
        void Add<T>(T entity) where T : class;

        void Delete<T>(T entity) where T : class;

        Task<bool> SaveAll();
        Task<PagedList<Product>> getAllProducts(ProductParams userParams);
        Task<Product> getProductPerId(int id);

        Task<IEnumerable<Category>> getAllCategories();

        //orders
        Task<IEnumerable<Order>> getAllOrders();
        Task<Order> getOrderPerId(int id);

        //user
        Task<User> getUserPerId(int id);

        //photos
        Task<Photo> GetPhoto(int id);
        Task<IEnumerable<Photo>> getPhotosForProduct(int productId);
        Task<Photo> GetMainPhotoForProduct(int id);
       double GetRating(int id);

    }
}
