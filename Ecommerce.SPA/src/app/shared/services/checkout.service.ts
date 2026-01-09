import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { ApiService } from '../../core/services/api.service';
import { Order } from '../../core/models/object-model';

@Injectable({
  providedIn: 'root',
})
export class CheckoutService {
  order_url = environment.server_url + '/api/';
  apiService = inject(ApiService);
  constructor() {}
  getAllorders() {}
  addOrder(orderItem: Order, userId: number) {
    return this.apiService.post(
      this.order_url + 'user/' + userId + '/Orders',
      orderItem
    );
  }
  getAllOrderStatus(){}
}
