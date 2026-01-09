import { Component, inject, OnInit } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AlertifyService } from '../../services/alertify.service';
import { AuthService } from '../../../auth/auth.service';
import { CommonModule } from '@angular/common';
import { CartService } from '../../services/cart.service';
import { HasRoleDirective } from '../../directives/has-role.directive';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, CommonModule, HasRoleDirective, RouterLinkActive],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
})
export class HeaderComponent implements OnInit {
  alertifyService = inject(AlertifyService);
  authService = inject(AuthService);
  cartService = inject(CartService);
  router = inject(Router);
  defaultImg = '../user.png';
  imageUrl!: any;
  carruntItemVal!: number;

  //isLoggedIn = false;
  decodedToken: any = null;
  ngOnInit(): void {
    this.authService.currentPhotoUrl.subscribe((photoURL) => {
      this.imageUrl = photoURL;
    });

    this.cartService.currentCartItemNum.subscribe((data) => {
      this.carruntItemVal = data;
    });

    //  // simple login check
    // this.isLoggedIn = this.authService.loggedin();

    // // reactive token subscription (recommended)
    // this.authService.decodedToken$.subscribe(token => {
    //   this.decodedToken = token;
    //   this.isLoggedIn = !!token; // updates automatically
    // });

  }

  loggedin() {
    if (typeof window !== 'undefined') {
      return !!localStorage.getItem('token'); // or whatever you're checking
    }
    return false; // or handle appropriately for SSR

    
  }
  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('cart');
    this.cartService.cartNumber.next(0);
    //localStorage.removeItem('user');
    this.authService.decodedToken = null;
    this.authService.setDecodedToken(null);
    //this.authService.currentUser = null;
    this.alertifyService.message('logged out');
    this.router.navigateByUrl('/home');
    // this.router.navigateByUrl('home');
  }
}
