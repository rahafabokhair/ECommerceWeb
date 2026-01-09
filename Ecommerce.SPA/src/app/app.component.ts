import { Component, Inject, inject, OnInit, PLATFORM_ID } from '@angular/core';
import { RouterOutlet, RouterModule } from '@angular/router';
import { HeaderComponent } from './shared/layout/header/header.component';
import { AuthService } from './auth/auth.service';
import { JwtHelperService } from '@auth0/angular-jwt';
import { User } from './core/models/object-model';
import { CartService } from './shared/services/cart.service';
import { HasRoleDirective } from './shared/directives/has-role.directive';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent implements OnInit {
  authService = inject(AuthService);
  cartService = inject(CartService);
  jwtHelper = new JwtHelperService();
  isBrowser: boolean;
  constructor(@Inject(PLATFORM_ID) platformId: Object){
    this.isBrowser = isPlatformBrowser(platformId);
  }
  ngOnInit(): void {
   if (this.isBrowser) {
    const token = localStorage.getItem('token');
    const cart = localStorage.getItem('cart');
    //const user: User = JSON.parse(localStorage.getItem('user') || '{}');

    if (token) {
      this.authService.decodedToken = this.jwtHelper.decodeToken(token);
      // this.authService.setDecodedToken(this.authService.decodedToken);
    }
    // if (user) {
    //   this.authService.currentUser = user;
    //  // this.authService.changePhotoUrl(user.photoURL);
    // }
    if (cart) {
      this.cartService.changeCartItem(JSON.parse(cart).length);
    }

    }
  }
}
