import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Cart } from '../../core/models/object-model';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  cartArray: Cart[] = [];
  cartNumber = new BehaviorSubject<number>(0);
  currentCartItemNum = this.cartNumber.asObservable();
  constructor() {}

  getValue() {
    return this.cartArray.values();
  }

  changeCartItem(cartNumber: number) {
    this.cartNumber.next(cartNumber);
  }

  addToCart(cartItem: Cart) {
    this.cartArray = JSON.parse(localStorage.getItem('cart') || '[]');
    this.cartArray.push(cartItem);
    localStorage.setItem('cart', JSON.stringify(this.cartArray));
    this.changeCartItem(this.cartArray.length);
  }

  updateCart(cartItem: Cart) {
    this.cartArray = JSON.parse(localStorage.getItem('cart') || '[]');
    let index = this.cartArray.findIndex((x) => {
      return x.id == cartItem.id;
    });
    this.cartArray[index].quantity += cartItem.quantity;
    localStorage.setItem('cart', JSON.stringify(this.cartArray));
    this.changeCartItem(this.cartArray.length);
  }
  removeFromCart(id: number) {
    this.cartArray = JSON.parse(localStorage.getItem('cart') || '[]');
    let index = this.cartArray.findIndex((x) => {
      return x.id == id;
    });
    this.cartArray.splice(index, 1);
    localStorage.setItem('cart', JSON.stringify(this.cartArray));
    this.changeCartItem(this.cartArray.length);
  }
}
