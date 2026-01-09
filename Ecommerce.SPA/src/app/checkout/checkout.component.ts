import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import {
  AbstractControl,
  Form,
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Address, Cart, Order } from '../core/models/object-model';
import { CheckoutService } from '../shared/services/checkout.service';
import { AuthService } from '../auth/auth.service';
import { AlertifyService } from '../shared/services/alertify.service';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.css',
})
export class CheckoutComponent implements OnInit {
  formBuilder = inject(FormBuilder);
  checkoutService = inject(CheckoutService);
  authService = inject(AuthService);
  alertifyService = inject(AlertifyService);

  orderForm!: FormGroup;
  order!: Order;
  cart: Cart[] = [];
  totalPrice = 0;
  totalAmount = 0;
  constructor() {
    this.initiateOrderForm();
  }
  ngOnInit(): void {
    if (typeof window !== 'undefined') {
      this.cart = JSON.parse(localStorage.getItem('cart') || '');
    }
    this.countTotalPrice();
    this.countTotalAmount();
  }
  initiateOrderForm() {
    this.orderForm = this.formBuilder.group({
      username: ['', [Validators.required]],
      country: ['', [Validators.required]],
      city: ['', [Validators.required]],
      state: ['', [Validators.required]],
      street: ['', [Validators.required]],
      postalCode: ['', [Validators.required]],
      phone: ['', [Validators.required]],
      note: ['', [Validators.required]],
      paymentWay: ['1', [Validators.required]],
    });
  }
  onAddOrder() {
    //console.log(this.orderForm.value);
    this.order = Object.assign({}, this.orderForm.value);
    let currentOrder: Order = {
      ...this.order,
      totalPrice: this.totalPrice,
      totalAmount: this.totalAmount,
      orderStatusId: 1,
    };

    this.checkoutService
      .addOrder(currentOrder, +this.authService.decodedToken.nameid)
      .subscribe(
        () => {
          this.alertifyService.success('Order Added');
          this.orderForm.reset();
        },
        (error) => {
          this.alertifyService.error(error);
        }
      );
  }
  countTotalPrice() {
    this.totalPrice = 0;
    for (let index = 0; index < this.cart.length; index++) {
      this.totalPrice += this.cart[index].price * this.cart[index].quantity;
    }
    return this.totalPrice;
  }
  countTotalAmount() {
    this.totalAmount = 0;
    for (let index = 0; index < this.cart.length; index++) {
      this.totalAmount += this.cart[index].quantity;
    }
    return this.totalAmount;
  }
  get f(): { [key: string]: AbstractControl } {
    return this.orderForm.controls;
  }
}
