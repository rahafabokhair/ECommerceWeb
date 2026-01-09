import { Component, inject } from '@angular/core';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../auth.service';
import { AlertifyService } from '../../shared/services/alertify.service';
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterModule, FormsModule, ReactiveFormsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  authService = inject(AuthService);
  alertifyService=inject(AlertifyService);
  router=inject(Router);
  onLogin(loginForm: any) {
    if (loginForm.valid) {
      let user = {
        username: loginForm.value.username,
        password: loginForm.value.password,
      };
      this.authService.login(user).subscribe(
         (next) => {
          this.alertifyService.success('user logged in succeccfully');
          this.router.navigateByUrl('/products');
        },
        (error) => {
          this.alertifyService.error(error);
        }
      );
    }
    loginForm.reset();
  }
}
