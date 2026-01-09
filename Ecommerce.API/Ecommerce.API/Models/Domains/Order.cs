namespace Ecommerce.API.Models.Domains
{
    public class Order
    {
        public int Id { get; set; }
        public string Note { get; set; }
        public int TotalPrice { get; set; }
        public int PaymentWay { get; set; }
        public DateTime OrderDate { get; set; }
        public int TotalAmount { get; set; }
        //public string Status { get; set; }

        //billing Details
        public string Country { get; set; }
        public string Street { get; set; }
        public string City { get; set; }
        public string State { get; set; }
        public string PostalCode { get; set; }

        public string Phone { get; set; }
        public int UserId { get; set; }
        public User User { get; set; }

        public int OrderStatusId { get; set; }
        public OrderStatus OrderStatus { get; set; }
    }
}
