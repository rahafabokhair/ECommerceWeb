import { Routes } from '@angular/router';
import { HomepageComponent } from './homepage/homepage.component';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { ProductsComponent } from './products/products/products.component';
import { productsResolver } from './shared/resolvers/products.resolver';
import { ProductDetailsComponent } from './products/product-details/product-details.component';
import { productDetailsResolver } from './shared/resolvers/product-details.resolver';
import { CartComponent } from './cart/cart/cart.component';
import { CheckoutComponent } from './checkout/checkout.component';
import { authGuard } from './auth/auth.guard';
import { AdminPanelComponent } from './admin/admin-panel/admin-panel.component';
import { PhotoManagementComponent } from './admin/photo-management/photo-management.component';

export const routes: Routes = [
  //{ path: '', component: ProductsComponent },
  { path: 'home', component: HomepageComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
 
  {
    path: '',
    runGuardsAndResolvers: 'always',
    canActivate: [authGuard],
    children: [
      {
        path: 'cart',
        component: CartComponent,
      },
      {
        path: 'checkout',
        component: CheckoutComponent,
      },
      {
        path: 'admin',
        component: AdminPanelComponent,

        data: { roles: ['Admin', 'Moderator'] },
      },

      {
        path: 'photo/:productId',
        component: PhotoManagementComponent,
      },
    ],
  },
 {
    path: 'products',
    component: ProductsComponent,
    resolve: { products: productsResolver },
  },

  {
    path: 'products/:id',
    component: ProductDetailsComponent,
    resolve: { product: productDetailsResolver },
  },
  // {
  //   path: '',
  //   runGuardsAndResolvers: 'always',
  //   canActivate: [authGuard],
  //   children: [
  //     {
  //       path: 'myCourses',
  //       component: MyCoursesListComponent,
  //       resolve: { myCourses: myCoursesResolver },
  //     },
  //     {
  //       path: 'myCourses/:id',
  //       component: MyCourseDetailsComponent,
  //       resolve: { myCourse: myCourseDetailsResolver },
  //     },
  //   ],
  // },
];
