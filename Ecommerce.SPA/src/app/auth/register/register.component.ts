import { Component, EventEmitter, inject, Output } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { UserService } from '../../shared/services/user.service';

import { FileUploadService } from '../../shared/services/file-upload.service';
import {
  BsDatepickerConfig,
  BsDatepickerModule,
} from 'ngx-bootstrap/datepicker';
import { switchMap } from 'rxjs';
import { AlertifyService } from '../../shared/services/alertify.service';
import { User } from '../../core/models/object-model';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, CommonModule, BsDatepickerModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
})
export class RegisterComponent {
  @Output() canceledRegister: any = new EventEmitter();
  formBuilder = inject(FormBuilder);
  authService = inject(AuthService);
  userService = inject(UserService);
  alertifyService = inject(AlertifyService);
  fileUploadService = inject(FileUploadService);

  router = inject(Router);
  registerForm!: FormGroup;

  //file
  selectedFile!: File;
  previewUrl: string | ArrayBuffer | null = null;
  bsConfig!: Partial<BsDatepickerConfig>;
  user!: User;

  constructor() {
    this.bsConfig = {
      containerClass: 'theme-red',
    };
    this.registerForminit();
  }

  registerForminit() {
    this.registerForm = this.formBuilder.group(
      {
        gender: ['male'],
        username: ['', [Validators.required]],
        dateOfBirth: [null, Validators.required],
        city: ['', Validators.required],
        country: ['', Validators.required],
        password: [
          '',
          [
            Validators.required,
            Validators.minLength(4),
            Validators.maxLength(8),
          ],
        ],
        confirmPassword: new FormControl('', Validators.required),
      },
      { validator: this.passwordMatchValidator }
    );
  }
  passwordMatchValidator(g: FormGroup) {
    return g.get('password')?.value === g.get('confirmPassword')?.value
      ? null
      : { mismatch: true };
  }
  onRegister(registerForm: any) {
    this.user= Object.assign({},registerForm.value);
    this.user = {
        ...this.user,
        roles: ["Member"]
      };
    this.authService.register(this.user).subscribe(
      () => {
        this.alertifyService.success('user registered');
      },
      (error) => {
        console.log(error);
        this.alertifyService.error(error);
      }
      ,()=>{
        this.authService.login(this.user).subscribe(()=>{
         // this.router.navigateByUrl('members');
        })
      }
    );
  }


  canceled() {
    this.canceledRegister.emit(false);
  }
  get f(): { [key: string]: AbstractControl } {
    return this.registerForm.controls;
  }
}
