import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { ApiService } from '../../core/services/api.service';
import { Params } from '@angular/router';
import { HttpParams } from '@angular/common/http';
import { Product, Rating } from '../../core/models/object-model';
import { PaginatedResult } from '../../core/models/pagination';
import { isEmpty, map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  product_url = environment.server_url + '/api/product';
  catergory_url = environment.server_url + '/api/Categories';
  rating_url = environment.server_url + '/api/Ratings/';
  search_url = environment.server_url + '/api/product/Search';
  apiService = inject(ApiService);
  constructor() {}

  getProducts(
    page?: any,
    itemsPerPage?: any,
    productParams?: any
  ): Observable<PaginatedResult<Product[]>> {
    const paginatedResult: PaginatedResult<Product[]> = new PaginatedResult<
      Product[]
    >();
    let params = new HttpParams();
 
    if (page != null && itemsPerPage != null) {
      params = params.append('pageNumber', page);
      params = params.append('pageSize', itemsPerPage);
    }
    if (productParams != null) {
      params = params.append('CategoryId', productParams.categoryId);
    }
    if (productParams != null) {
      params = params.append('Search', productParams.search);
    }
    return this.apiService.getWithResponse(this.product_url, params).pipe(
      map((response: any) => {
        paginatedResult.result = response.body;
        if (response.headers.get('pagination') != null) {
          paginatedResult.pagination = JSON.parse(
            response.headers.get('pagination')
          );
        }
        return paginatedResult;
      })
    );
  }

  getProductPerId(id: number) {
    return this.apiService.get(this.product_url + '/' + id);
  }
  getCategories() {
    return this.apiService.get(this.catergory_url);
  }

  addRating(ratingObj: Rating) {
    return this.apiService.post(this.rating_url, ratingObj);
  }
  getRating(id: number) {
    return this.apiService.get(this.rating_url + id);
  }

  // search(productParams?: any) {
  //   console.log(productParams);

  //   let params = new HttpParams();
  //   if (productParams != null) {
  //     params = params.append('Name', productParams);
  //   }

  //   return this.apiService.getWithResponse(this.search_url, params);
  // }
}
