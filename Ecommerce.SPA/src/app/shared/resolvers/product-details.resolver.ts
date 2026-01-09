import { inject } from '@angular/core';
import { ActivatedRoute, ResolveFn, Router } from '@angular/router';
import { AlertifyService } from '../services/alertify.service';
import { ProductService } from '../services/product.service';
import { catchError, of } from 'rxjs';
import { Product } from '../../core/models/object-model';

export const productDetailsResolver:  ResolveFn<Product | null> = (route, state) => {
let alertifyService=inject(AlertifyService);
let router=inject(Router);
let productService=inject(ProductService);

return productService.getProductPerId(route.params['id']).pipe( catchError((error) => {    
      alertifyService.error('problem recieving data');
      router.navigate(['/products']);
      return of(null);
    }));
};
