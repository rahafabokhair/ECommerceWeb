import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateFn, Router } from '@angular/router';
import { AlertifyService } from '../shared/services/alertify.service';
import { AuthService } from './auth.service';

export const authGuard: CanActivateFn = (next: ActivatedRouteSnapshot) => {
  const authService = inject(AuthService);
  const alertifyService = inject(AlertifyService);
  const router = inject(Router);

  const roles = next.firstChild?.data['roles'] as Array<string>;
  
  if (roles) {
    const isMatch = authService.roleMatch(roles);
    if (isMatch) {
      return true;
    } else {
      router.navigate(['home']);
      alertifyService.error('your not authorized to access this area');
    }
  }

  if (authService.loggedin()) {
    return true;
  }

  router.navigateByUrl('home');
  alertifyService.error('you shall not pass !!');
  return false;
};
