import { Component } from '@angular/core';
import { ApiService } from '../api.service';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [ReactiveFormsModule,CommonModule],
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.scss'
})
export class ForgotPasswordComponent {
  forgotPasswordForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email])
  });

  message = '';
  loading = false;

  constructor(private apiService: ApiService , private router : Router) {}

  onForgotPassword() {
    this.loading = true;
    if (this.forgotPasswordForm.valid) {
      this.apiService.forgotPassword(this.forgotPasswordForm.value.email).subscribe(
        (res) => {
          this.loading = false;
          localStorage.setItem('email', this.forgotPasswordForm.value.email ?? '');
          this.router.navigate(['/reset-pass']);
        },
        (err) => {
          
          this.message = err.error?.message || 'Error sending OTP';
        }
      );
    }
  }
}
