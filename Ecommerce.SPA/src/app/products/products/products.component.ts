import { Component, inject } from '@angular/core';
import { Cart, Category, Product } from '../../core/models/object-model';
import { ProductService } from '../../shared/services/product.service';
import { TabsetComponent, TabsModule } from 'ngx-bootstrap/tabs';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { AlertifyService } from '../../shared/services/alertify.service';
import { PageChangedEvent, PaginationModule } from 'ngx-bootstrap/pagination';
import { PaginatedResult, Pagination } from '../../core/models/pagination';
import { FormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged, Subject } from 'rxjs';
import { CartService } from '../../shared/services/cart.service';
@Component({
  selector: 'app-products',
  standalone: true,
  imports: [
    TabsModule,
    CommonModule,
    RouterLink,
    PaginationModule,
    FormsModule,
  ],
  templateUrl: './products.component.html',
  styleUrl: './products.component.css',
})
export class ProductsComponent {
  products: Product[] = [];
  categories: Category[] = [];
  productService = inject(ProductService);
  route = inject(ActivatedRoute);
  alertifyService = inject(AlertifyService);
  cartService = inject(CartService);
  productParams: any = {};
  queryParams: any;
  pagination!: Pagination;
  defaultImg = '../default.jpg';

  activeCategoryId!: any;

  searchTerm: string = '';

  quantity: number = 1;
  localCartArray!: Cart[];
  private searchSubject = new Subject<string>();


  constructor() {
    this.getAllCategories();
    this.productParams.search = '';
    this.productParams.categoryId = 1;
    this.pagination = this.route.snapshot.data['products'].pagination;
    this.products = this.route.snapshot.data['products'].result;

    // this.route.queryParams.subscribe((data) => {
    //   console.log(data['cate']);
    //   this.queryParams=+data['cate'];
    //   this.productParams.categoryId = this.queryParams;
    //   this.onTabSelect(this.productParams.categoryId);
    //   //this.loadProducts();
    // });

    this.route.queryParams.subscribe((params) => {
      const cat = params['cate'];
      if (cat) {
        setTimeout(() => {
          // <-- fixes NG0100
          this.selectCategoryByName(cat);
        });
      }
    });

    // Search debounce
    this.searchSubject
      .pipe(debounceTime(300), distinctUntilChanged())
      .subscribe((term) => {
        this.productParams.search = term;
        this.loadProducts();
        // this.productService.search(term).subscribe(data =>
        //   console.log(data)
        // );
        // this.products = data);
      });
  }

  // getAllProducts() {
  //   this.products = this.route.snapshot.data['products'];
  // }
  onSearchChange() {
    this.searchSubject.next(this.searchTerm);
  }

  getAllCategories() {
    this.productService.getCategories().subscribe((data) => {
      this.categories = data;
    });
  }

  loadProducts() {
    this.productService
      .getProducts(
        this.pagination.currentPage,
        this.pagination.itemsPerPage,
        this.productParams
      )
      .subscribe(
        (res: PaginatedResult<Product[]>) => {
          this.products = res.result;
          this.pagination = res.pagination;
        },
        (error) => {
          this.alertifyService.error(error);
        }
      );
  }

  pageChanged(event: PageChangedEvent): void {
    this.pagination.currentPage = event.page;
    this.loadProducts();
  }

  selectCategoryByName(name: string) {
    const category = this.categories.find(
      (c) => c.name.toLowerCase() === name.toLowerCase()
    );

    if (!category) return;

    // set active tab
    this.activeCategoryId = category.id;

    // load products
    this.onTabSelect(category.id);
  }

  onTabSelect(categoryId: any) {
    // console.log(categoryId);

    this.productParams.categoryId = categoryId;
    this.loadProducts();
  }


  
  addToCart(product: Product) {
    let cartItem = {
      ...product,
      quantity: this.quantity,
    };

    this.localCartArray = JSON.parse(localStorage.getItem('cart') || '[]');
    if (this.localCartArray.length > 0) {
      //////find index/////
      let existIndex = this.localCartArray.findIndex((x) => {
        return x.id == product.id;
      });
      if (existIndex < 0) {
        this.cartService.addToCart(cartItem);
      } else {
        this.cartService.updateCart(cartItem);
        console.log('this item added before');
      }
    } else {
      this.cartService.addToCart(cartItem);
    }
  }
// onImageError(event: Event) {
//   (event.target as HTMLImageElement).src =
//     '../default.jpg';
// }
}
