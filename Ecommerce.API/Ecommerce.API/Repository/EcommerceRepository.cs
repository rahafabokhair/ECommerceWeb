using Ecommerce.API.Data;
using Ecommerce.API.Helper;
using Ecommerce.API.Models.Domains;
using Microsoft.EntityFrameworkCore;

namespace Ecommerce.API.Repository
{
    public class EcommerceRepository : IEcommerceRepository
    {
        private readonly EcommerceDBContext _dbContext;

        public EcommerceRepository(EcommerceDBContext ecommerceDBContext)
        {
            _dbContext = ecommerceDBContext;
        }

        public async Task<IEnumerable<Category>> getAllCategories()
        {
            return await _dbContext.categories.ToListAsync();
        }


        public async Task<PagedList<Product>> getAllProducts(ProductParams productParams)
        {
            var products = _dbContext.Products.Include(p => p.Photos).AsQueryable();
            if (productParams.CategoryId != 0)
            {
                products = products.Where(p => p.categoryId == productParams.CategoryId);
            }
            //if (!string.IsNullOrWhiteSpace(productParams.Name))
            //{
            //    products = products.Where(p => p.name.Contains(productParams.Name));
            //}

            // 🔍 Search filter
            if (!string.IsNullOrEmpty(productParams.Search))
            {
                products = products.Where(p =>
                    p.name.Contains(productParams.Search) ||
                    p.Description.Contains(productParams.Search)
                );
            }

            return await PagedList<Product>.CreateAsync(
                products, productParams.PageNumber, productParams.PageSize);

        }

        public async Task<Product> getProductPerId(int id)
        {
            var product = await _dbContext.Products.Include(p => p.Photos).FirstOrDefaultAsync(p => p.Id == id);

            return product;
        }

        //public async Task<ProductToDetailsDto> getProductPerId(int id)
        //{
        //    var product = await _dbContext.Products.Include(p => p.Photos).Select(p => new ProductToDetailsDto
        //    {
        //        Id = p.Id,
        //        Name = p.name,
        //        Price = p.Price,
        //        Description = p.Description,
        //        Brand = p.Brand,


        //        AverageRating = (int)(p.Ratings.Any()
        //        ? p.Ratings.Average(r => r.Rating)
        //        : 0),

        //    })
        //.FirstOrDefaultAsync();
        //    return product;
        //}


        //order
        public async Task<Order> getOrderPerId(int id)
        {
            return await _dbContext.Orders.FirstOrDefaultAsync(p => p.Id == id);
        }
        public async Task<IEnumerable<Order>> getAllOrders()
        {
            return await _dbContext.Orders.OrderByDescending(o=>o.OrderDate).ToListAsync();
        }

        public void Add<T>(T entity) where T : class
        {
            _dbContext.Add(entity);
        }

        public void Delete<T>(T entity) where T : class
        {
            _dbContext.Remove(entity);
        }

        public async Task<bool> SaveAll()
        {
           //return await _dbContext.SaveChangesAsync() > 0;
            await _dbContext.SaveChangesAsync();
            return true;
        }

        public async Task<User> getUserPerId(int id)
        {
            return await _dbContext.Users.FirstOrDefaultAsync(u => u.Id == id);
        }

        public async Task<Photo> GetPhoto(int id)
        {
            var photo = await _dbContext.Photos.FirstOrDefaultAsync(x => x.Id == id);
            return photo;
        }

        public async Task<Photo> GetMainPhotoForProduct(int productId)
        {
            var mainPhoto = await _dbContext.Photos.Where(x => x.productId == productId).FirstOrDefaultAsync(u => u.IsMain);
            return mainPhoto;
        }

        public async Task<IEnumerable<Photo>> getPhotosForProduct(int productId)
        {
            var photos = _dbContext.Photos.Where(p => p.productId == productId).AsQueryable();
            //photos =await photos.Where(p => p.Photos == productId).ToListAsync();
            return await photos.ToListAsync();

        }
        //rating
        public double GetRating(int productId)
        {
            var ratings = _dbContext.ProductRatings
           .Where(r => r.ProductId == productId)
           .ToList();

            var averageRating = ratings.Any() ? ratings.Average(r => r.Rating) : 0;
            return ((double)averageRating);
        }
    }
}
