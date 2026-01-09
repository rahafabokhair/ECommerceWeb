using Ecommerce.API.Data;
using Ecommerce.API.Helper;
using Ecommerce.API.Mappers;
using Ecommerce.API.Models.Domains;
using Ecommerce.API.Repository;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Http.Features;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.FileProviders;
using Microsoft.IdentityModel.Tokens;
using System.Text;

var builder = WebApplication.CreateBuilder(args);
var MyAllowSpecificOrigins = "_myAllowSpecificOrigins";
// Add services to the container.

builder.Services.AddControllers();
builder.Services.AddHttpContextAccessor();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddScoped<ITokenRepository, TokenRepository>();
builder.Services.AddScoped<IEcommerceRepository, EcommerceRepository>();
builder.Services.AddScoped<IImageRepository, LocalImageRepository>();

////inject DatingAppDBContext
builder.Services.AddDbContext<EcommerceDBContext>(options =>
options.UseSqlServer(builder.Configuration.GetConnectionString("EcommerceAppConnectionString")));

//add Mapper
builder.Services.AddAutoMapper(typeof(AutoMapperProfiles));
/////////////////////
//builder.Services.AddMvc().SetCompatibilityVersion(CompatibilityVersion.Version_2_1).AddJsonOptions(opt =>
//{
//    opt.JsonSerializerOptions.ReferenceHandler = ReferenceHandler.IgnoreCycles;
//});

///////////////////////
///
//Cors configration
builder.Services.AddCors(options =>
{
    options.AddPolicy(name: MyAllowSpecificOrigins,
                      builder =>
                      {
                          builder.AllowAnyOrigin()
                        .AllowAnyMethod()
                        .AllowAnyHeader()
                        .WithExposedHeaders("Pagination"); ;
                      });
});
builder.Services.Configure<FormOptions>(options =>
{
    options.MultipartBodyLengthLimit = 10 * 1024 * 1024; // 10MB
});

//add Identity
builder.Services
    .AddIdentityCore<User>(options =>
    {
        options.Password.RequireDigit = false;
        options.Password.RequireLowercase = false;
        options.Password.RequireNonAlphanumeric = false;
        options.Password.RequireUppercase = false;
        options.Password.RequiredLength = 6;
        options.Password.RequiredUniqueChars = 1;
    })
    .AddRoles<Role>() // <-- still supports roles
    .AddRoleManager<RoleManager<Role>>()
    .AddSignInManager<SignInManager<User>>()
    .AddEntityFrameworkStores<EcommerceDBContext>()
    .AddDefaultTokenProviders();

//add authentication
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
 .AddJwtBearer(options => options.TokenValidationParameters = new
TokenValidationParameters
 {
     ValidateIssuer = false,
     ValidateAudience = false,
     ValidateLifetime = true,
     ValidateIssuerSigningKey = true,
     IssuerSigningKey = new SymmetricSecurityKey(
 Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Key"]))
 });
builder.Services.AddAuthorization(option =>
{
    option.AddPolicy("RequireAdminRole", policy => policy.RequireRole("Admin"));
    option.AddPolicy("ModeratePhotoRole", policy => policy.RequireRole("Admin", "Moderator"));
    option.AddPolicy("ModerateRole", policy => policy.RequireRole("VIP"));
    option.AddPolicy("VipOnly", policy => policy.RequireRole("VIP"));

});

//builder.Services.AddControllers()
//    .AddJsonOptions(opt =>
//    {
//        opt.JsonSerializerOptions.ReferenceHandler = ReferenceHandler.IgnoreCycles;
//    });
builder.Services.Configure<CloudinarySettings>(
    builder.Configuration.GetSection("CloudinarySettings")
);

// Register CloudinaryService
builder.Services.AddScoped<CloudinaryService>();
builder.Services.Configure<FormOptions>(options =>
{
    options.MultipartBodyLengthLimit = 268435456;
});


////add seed class  "Running once"
//builder.Services.AddScoped<Seed>();
var app = builder.Build();

//////seed data "Running once"
//using (var scope = app.Services.CreateScope())
//{
//    var services = scope.ServiceProvider;
//    var context = services.GetRequiredService<EcommerceDBContext>();
//    var seeder = services.GetRequiredService<Seed>();
//    // Check for existing data
//    if (!context.Users.Any())
//    {
//        seeder.SeedUsers();
//        context.SaveChanges();
//    }
//}
// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}
app.UseCors(MyAllowSpecificOrigins);
app.UseHttpsRedirection();


app.UseAuthorization();
//app.UseStaticFiles(new StaticFileOptions
//{
//    FileProvider = new PhysicalFileProvider(Path.Combine(Directory.GetCurrentDirectory(), "Images")),
//    RequestPath = "/Images"
//});
app.MapControllers();

app.Run();
