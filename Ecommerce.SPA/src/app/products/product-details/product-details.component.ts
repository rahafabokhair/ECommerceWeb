import { Component, inject, OnInit } from '@angular/core';
import {
  NgxGalleryImage,
  NgxGalleryModule,
  NgxGalleryOptions,
} from '@kolkov/ngx-gallery';
import { Cart, Product, Rating } from '../../core/models/object-model';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CartService } from '../../shared/services/cart.service';

import { NgxStarsModule } from 'ngx-stars';
import { AlertifyService } from '../../shared/services/alertify.service';
import { ProductService } from '../../shared/services/product.service';
import { RatingComponent } from '../../shared/components/rating/rating.component';
@Component({
  selector: 'app-product-details',
  standalone: true,
  imports: [
    NgxGalleryModule,
    CommonModule,
    TabsModule,
    FormsModule,
    NgxStarsModule,
    ReactiveFormsModule,
  ],
  templateUrl: './product-details.component.html',
  styleUrl: './product-details.component.css',
})
export class ProductDetailsComponent implements OnInit {
  product!: Product;
  route = inject(ActivatedRoute);
  cartService = inject(CartService);
  alertifyService = inject(AlertifyService);
  productService = inject(ProductService);
  galleryOptions!: NgxGalleryOptions[];
  galleryImages!: NgxGalleryImage[];

  quantity: number = 1;
  localCartArray!: Cart[];
  //localCartArraylength: any;
  addedCart = false;
  defaultImg = '../default.jpg';

  rating: any;
  //ratings: any[] = [];

  ratingObj: any;
  type = { full: 'full' };
  constructor() {}

  ngOnInit(): void {
    if (typeof window !== 'undefined') {
      this.localCartArray = JSON.parse(localStorage.getItem('cart') || '[]');
    }

    // this.localCartArraylength = this.localCartArray.length;
    // this.cartService.currentCartItemNum.subscribe((num) => {
    //   this.localCartArraylength = num;
    // });
    this.getProductPerId();

    this.gallaryFunction();
    // setTimeout(() => {
    //   this.getRating(this.product.id);
    // }, 200);
  }

  // getRating(id: number) {
  //   this.productService.getRating(id).subscribe((data) => {
  //     console.log(data);

  //     this.rating = 5;
  //   });
  // }

  getProductPerId() {
    this.product = this.route.snapshot.data['product'];
  }
  gallaryFunction() {
    this.galleryOptions = [
      {
        width: '600px',
        height: '400px',
        thumbnails: true,
        imageAnimation: 'slide',
      },
    ];
    this.galleryImages = this.getImages();
  }

  getImages() {
    const imageUrls: any = [];
    const photo = this.product.photos;

    if (this.product.photos?.length) {
      for (let index = 0; index < this.product.photos.length; index++) {
        imageUrls.push({
          small: this.product.photos[index].url,
          medium: this.product.photos[index].url,
          big: this.product.photos[index].url,
          description: this.product.photos[index].description,
        });
      }
    } else {
      imageUrls.push({
        small: this.defaultImg,
        medium: this.defaultImg,
        big: this.defaultImg,
        description: '',
      });
    }

    return imageUrls;
  }
  changeQty(val: string) {
    if (val == 'minus' && this.quantity > 0) {
      this.quantity -= 1;
    } else {
      if (val == 'plus' && this.quantity < 5) {
        this.quantity += 1;
      }
    }
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

  onUserRate(ratingVal: number, Id: number) {
    var newRating = Math.round(ratingVal);
    var ratingObj: Rating = {
      ProductId: Id,
      comment: 'comment',
      rating: newRating,
    };
    this.alertifyService.confirm(
      'Are you sure you want to add rating to this product?',
      () => {
        console.log('User rating selected:', newRating);
        this.productService.addRating(ratingObj).subscribe(() => {
          this.alertifyService.success('rating added');
        });
      }
    );
    // send to backend, update product, etc.
  }
}
