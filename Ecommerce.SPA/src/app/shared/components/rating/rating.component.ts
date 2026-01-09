import { CommonModule } from '@angular/common';
import { Component, inject, Input } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { NgxStarsModule } from 'ngx-stars';
import { ProductService } from '../../services/product.service';

@Component({
  selector: 'app-rating',
  standalone: true,
  imports: [CommonModule, FormsModule, NgxStarsModule, ReactiveFormsModule],

  templateUrl: './rating.component.html',
  styleUrl: './rating.component.css',
})
export class RatingComponent {
  @Input() productId!: number;
  productService = inject(ProductService);
  rating= 3;

  constructor() {
    setTimeout(() => {
      this.getRating();
    }, 200);
  }

  getRating() {
    this.productService.getRating(this.productId).subscribe((data) => {
      console.log(data);
      this.rating = 4;
    });
  }
  onUserRate(ratingVal: number) {
    console.log(ratingVal);

    // var newRating = Math.round(ratingVal);
    // var ratingObj: Rating = {
    //   ProductId: Id,
    //   comment: 'comment',
    //   rating: newRating,
    // };
    // this.alertifyService.confirm(
    //   'Are you sure you want to add rating to this product?',
    //   () => {
    //     console.log('User rating selected:', newRating);
    //     this.productService.addRating(ratingObj).subscribe(() => {
    //       this.alertifyService.success('rating added');
    //     });
    //   }
    // );
    // // send to backend, update product, etc.
  }
}
