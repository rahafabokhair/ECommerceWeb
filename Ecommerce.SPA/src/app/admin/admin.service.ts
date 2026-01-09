import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { ApiService } from '../core/services/api.service';
import { Photo, Product, User } from '../core/models/object-model';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AdminService {
  base_url = environment.server_url + '/api/admin/';
  product_url = environment.server_url + '/api/product/';
  apiService = inject(ApiService);

  photoUrl = new BehaviorSubject<string>('../default.png');
  currentPhotoUrl = this.photoUrl.asObservable();
  constructor() {}
  getAllUsersWithRoles() {
    return this.apiService.get(this.base_url + 'usersWithRoles');
  }
  edituserRoles(user: User, roles: {}) {
    return this.apiService.post(
      this.base_url + 'editRoles/' + user.userName,
      roles
    );
  }

  //product
  editProduct(id: number, product: Product) {

    return this.apiService.put(
      this.base_url + 'ProductForModeration/' + id,
      product
    );
  }

  addProduct(product: Product) {
    return this.apiService.post(this.base_url + 'ProductForCreation/', product);
  }

  deleteProduct(productId: number) {
    return this.apiService.delete(
      this.base_url + 'ProductForDelete/' + productId
    );
  }
  //photo
  changePhotoUrl(photoUrl: string) {
    this.photoUrl.next(photoUrl);
  }
  setMainPhoto(photo: Photo, productId: number) {
    return this.apiService.post(
      this.product_url + productId + '/photos/' + photo.id + '/setMain'
    );
  }
  deletePhoto(photoId: number, productId: number) {
    return this.apiService.delete(
      this.product_url + productId + '/photos/' + photoId
    );
  }
  //ordrs
  getAllOrders() {
    return this.apiService.get(this.base_url + 'Orders');
  }

  editOrderStatus(orderId: number, status: any) {
    // http://localhost:5226/api/admin/OrderForModeration/10
   return this.apiService.put(this.base_url + 'OrderForModeration/' + orderId, status);
  }
}
