export class User {
  constructor(
    public userName: string,
    public gender: string,
    public photoURL: string,
    public password: string,
    public dateOfBirth: string,
    public ClassOrderId: number,
    public roles: string[],
    public id?: number
  ) {}
}

export class Product {
  constructor(
    public name: string,
    public price: number,
    public description: string,
    public brand: string,
    public specification: string,
    public photoURL: string,
    public averageRating: number,
    public categoryId: number,
    public id: number,
    public photos?: Photo[]
  ) {}
}

export class Photo {
  constructor(
    public id: number,
    public url: string,
    public description: string,
    public dateAdded: Date,
    public isMain: boolean
  ) {}
}
export class Category {
  constructor(public id: number, public name: string) {}
}
export class Cart {
  constructor(
    public name: string,
    public price: number,
    public brand: string,
    public photoURL: string,
    public quantity: number,
    public id: number
  ) {}
}

export class Order {
  constructor(
    public username: string,
    public note: string,
    public totalPrice: number,
    public paymentWay: number,
    public totalAmount: number,
    public orderStatusId: number,
    public country: string,
    public street: string,
    public city: string,
    public state: string,
    public postalCode: string,
    public phone: string,

    public id: number,

    public orderDate?: string
  ) {}
}

export class Address {
  constructor() {}
}
export class Rating {
  constructor(
    public rating: number,
    public comment: string,
    public ProductId: number
  ) {}
}


export class ProductParams {
  pageNumber = 1;
  pageSize = 10;
  categoryId = 0;
  search = '';
}
// export class Status {
//   constructor(public id: number, public name: string) {}
// }
