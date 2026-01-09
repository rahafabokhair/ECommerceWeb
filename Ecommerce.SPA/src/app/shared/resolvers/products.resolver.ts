import { inject } from '@angular/core';
import { ActivatedRoute, ResolveFn, Router } from '@angular/router';
import { ProductService } from '../services/product.service';
import { AlertifyService } from '../services/alertify.service';
import { Product } from '../../core/models/object-model';
import { catchError, of } from 'rxjs';
import { PaginatedResult } from '../../core/models/pagination';

export const productsResolver: ResolveFn<PaginatedResult<Product[]> | null> = (
  route,
  state
) => {
  let productService = inject(ProductService);
  let alertifyService = inject(AlertifyService);
  let router = inject(Router);

  const pageNumber = 1;
  const pageSize = 5;


  return productService.getProducts(pageNumber, pageSize).pipe(
    catchError((error) => {
      alertifyService.error('problem recieving data');
      router.navigate(['home']);
      return of(null);
    })
  );
};
