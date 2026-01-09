import { Component, inject } from '@angular/core';
import { ProductService } from '../../shared/services/product.service';
import { AdminService } from '../admin.service';
import { Category, Product } from '../../core/models/object-model';
import { PaginatedResult, Pagination } from '../../core/models/pagination';
import { AlertifyService } from '../../shared/services/alertify.service';
import {
  BsModalRef,
  BsModalService,
  ModalModule,
  ModalOptions,
} from 'ngx-bootstrap/modal';
import { CommonModule } from '@angular/common';
import { ProductsModalComponent } from '../products-modal/products-modal.component';
import { log } from 'node:console';
import { PageChangedEvent, PaginationModule } from 'ngx-bootstrap/pagination';
import { FormsModule } from '@angular/forms';
import { FileUploadService } from '../../shared/services/file-upload.service';
import { switchMap } from 'rxjs';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-product-management',
  standalone: true,
  imports: [
    CommonModule,
    ModalModule,
    PaginationModule,
    FormsModule,
    RouterLink,
  ],
  providers: [BsModalService],
  templateUrl: './product-management.component.html',
  styleUrl: './product-management.component.css',
})
export class ProductManagementComponent {
  bsModalRef?: BsModalRef;

  productService = inject(ProductService);
  adminService = inject(AdminService);
  alertifyService = inject(AlertifyService);
  fileUploadService = inject(FileUploadService);

  products: Product[] = [];
  categories: Category[] = [];
  pagination!: Pagination;
  productParams: any = {};

  defaultImg = '../default.jpg';
  constructor(private modalService: BsModalService) {
    this.getAllCategories();
    this.getAllProducts();
  }
  getAllCategories() {
    this.productService.getCategories().subscribe((data) => {
      this.categories = data;
    });
  }
  getAllProducts() {
    this.productService.getProducts(1, 5).subscribe(
      (res: PaginatedResult<Product[]>) => {
        this.products = res.result;
        console.log(this.products);
        
        this.pagination = res.pagination;
      },
      (error) => {
        this.alertifyService.error(error);
      }
    );
  }

  loadProducts() {
    this.productService
      .getProducts(this.pagination.currentPage, this.pagination.itemsPerPage)
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

  editProductModal(product: any) {
    const initialState: ModalOptions = {
      initialState: {
        product,
      },
    };
 

    this.bsModalRef = this.modalService.show(
      ProductsModalComponent,
      initialState
    );

    if (product) {
      this.bsModalRef.content.updateProductValues.subscribe(
        (values: Product) => {

          this.adminService.editProduct(values.id, values).subscribe(
            () => {
              this.alertifyService.success('product updated successfully');
            },
            (error) => {
              this.alertifyService.error('error update product'+ error);
            }
          );
        }
      );
    } else {
      this.bsModalRef.content.updateProductValues.subscribe((values: any) => {
        this.adminService.addProduct(values).subscribe(
          (product) => {
            this.products.push(product);
            this.alertifyService.success('product Added successfully');
          },
          (error) => {
            this.alertifyService.error('error');
          }
        );
      });
    }

    this.bsModalRef.content.closeBtnName = 'Close';
  }
  deleteProduct(id: number) {
    this.alertifyService.confirm(
      'Are you sure you want to delete this product?',
      () => {
        this.adminService.deleteProduct(id).subscribe(
          () => {
            var index = this.products.findIndex((p) => p.id == id);
            this.products.splice(index, 1);
            this.alertifyService.success('product deleted successfully');
          },
          (error) => {
            this.alertifyService.error(error);
          }
        );
      }
    );
  }

  updateProductsPhotos(id: number) {
    console.log(id);
  }
}
