import { Component, inject, OnInit } from '@angular/core';
import { Cart } from '../../core/models/object-model';
import { CartService } from '../../shared/services/cart.service';
import { CommonModule } from '@angular/common';
import { RouterLink } from "@angular/router";

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css',
})
export class CartComponent implements OnInit {
  cartService = inject(CartService);
  cart: Cart[] = [];
  total: number = 0;

  constructor() {}
  ngOnInit(): void {
    if (typeof window !== 'undefined') {
      this.cart = JSON.parse(localStorage.getItem('cart') || '[]');   
    }
    this.calculateTotalPrice();
  }

  removeItemFromCart(id: number) {
    this.cartService.removeFromCart(id);
    let index = this.cart.findIndex((x) => {
      return x.id == id;
    });
    this.cart.splice(index, 1);
    this.calculateTotalPrice();
  }
  calculateTotalPrice() {
    this.total = 0;
    for (let index = 0; index < this.cart.length; index++) {
      let itemtotal = this.cart[index].price * this.cart[index].quantity;
      this.total += itemtotal;
    }
    return this.total;
  }
}
