import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { ApiService } from '../../core/services/api.service';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  classOrder_url = environment.server_url + '/api/ClassOrder';
  apiService = inject(ApiService);
  
  constructor() {}
  getClassOrder() {
    return this.apiService.get(this.classOrder_url);
  }
}
