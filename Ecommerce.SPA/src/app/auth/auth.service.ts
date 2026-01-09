import { Inject, inject, Injectable, PLATFORM_ID } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { ApiService } from '../core/services/api.service';
import { User } from '../core/models/object-model';
import { BehaviorSubject, map, Observable } from 'rxjs';
import { JwtHelperService } from '@auth0/angular-jwt';
import { isPlatformBrowser } from '@angular/common';
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  auth_url = environment.server_url + '/api/auth/';
  apiService = inject(ApiService);
  jwtHelper = new JwtHelperService();
  public decodedToken: any;
  //currentUser!: any;

  private decodedTokenSubject = new BehaviorSubject<any>(null);
  decodedToken$ = this.decodedTokenSubject.asObservable();

  setDecodedToken(token: any) {
    this.decodedTokenSubject.next(token);
  }

  photoURL = new BehaviorSubject<string>('../../user.png');
  currentPhotoUrl = this.photoURL.asObservable();

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  // changePhotoUrl(photoUrl: string) {
  //   this.photoURL.next(photoUrl);
  // }

  login(userInfo: any) {
    return this.apiService.post(this.auth_url + 'login', userInfo).pipe(
      map((user) => {
        if (user) {
          localStorage.setItem('token', user.token);
          this.decodedToken = this.jwtHelper.decodeToken(user.token);
          this.setDecodedToken(this.decodedToken);

          //localStorage.setItem('user', JSON.stringify(user.user));
          //this.currentUser = user.user;
          // this.changePhotoUrl(this.currentUser?.photoURL);
        }
      })
    );
  }

  register(user: User) {
    return this.apiService.post(this.auth_url + 'register', user);
  }


  loggedin() {
  if (isPlatformBrowser(this.platformId)) {
    const token = localStorage.getItem('token');

    if (token && !this.jwtHelper.isTokenExpired(token)) {
      const decoded = this.jwtHelper.decodeToken(token);
      this.setDecodedToken(decoded);  // <-- save the real decoded token
      return true;
    }

    this.setDecodedToken(null); // clear decoded token when not logged in
    return false;
  }

  return false;
}


  get userId(): string | null {
    return this.decodedToken ? this.decodedToken.nameid : null;
  }
  roleMatch(allowedRoles: string[]): boolean {
    let isMatch = false;
    if (this.decodedToken) {
      const userRoles = this.decodedToken.role as Array<string>;
      allowedRoles.forEach((element) => {
        if (userRoles.includes(element)) {
          isMatch = true;
          return;
        }
      });
    }
    return isMatch;
  }
}
