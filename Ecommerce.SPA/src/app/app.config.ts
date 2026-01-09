import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import {
  provideClientHydration,
  withHttpTransferCacheOptions,
} from '@angular/platform-browser';
import {
  HTTP_INTERCEPTORS,
  provideHttpClient,
  withInterceptors,
  withInterceptorsFromDi,
} from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';
import { errorInterceptor } from './shared/interceptors/error.interceptor';
import { JWT_OPTIONS, JwtHelperService } from '@auth0/angular-jwt';
import { CustomJwtInterceptor } from './shared/interceptors/custom-jwt.interceptor';

// export function tokenGetter() {
//   return localStorage.getItem('token'); // Ensure this matches where you store the token
// }

export function tokenGetter() {
  if (typeof window !== 'undefined' && localStorage) {
    return localStorage.getItem('token');
  }
  return null;
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideAnimations(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideClientHydration(
      withHttpTransferCacheOptions({
        includeHeaders: ['pagination'], //  global setting
      })
    ),
    provideHttpClient(
      withInterceptors([errorInterceptor]),
      withInterceptorsFromDi()
    ),
    {
      provide: JWT_OPTIONS,
      useValue: {
        tokenGetter: tokenGetter,
        allowedDomains: ['localhost'], // Set your API domain
        disallowedRoutes: ['localhost/api/auth'], // Exclude auth routes
      },
    },
    JwtHelperService, // ✅ Add this line to provide JwtHelperService
    { provide: HTTP_INTERCEPTORS, useClass: CustomJwtInterceptor, multi: true },
  ],
};
