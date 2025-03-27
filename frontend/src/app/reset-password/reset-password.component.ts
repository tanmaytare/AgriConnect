import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ApiService } from '../api.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [ReactiveFormsModule,CommonModule],
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.scss'
})
export class ResetPasswordComponent {
  resetPasswordForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    otp: new FormControl('', [Validators.required, Validators.minLength(6)]),
    newPassword: new FormControl('', [Validators.required, Validators.minLength(6)])
  });

  loading = false;
  message = '';
  email!: string;

  ngOnInit() {
    this.email = localStorage.getItem('email') || '';
    if (!this.email) {
      console.log('No email found, redirecting to signup...');
      this.router.navigate(['/signup']);
    }
  }

  constructor(private apiService: ApiService, private router: Router) {}

  onResetPassword() {
    if (this.resetPasswordForm.valid) {
      this.loading = true;
      const { email, otp, newPassword } = this.resetPasswordForm.value;
      this.apiService.resetPassword(email, otp, newPassword).subscribe(
        (res) => {
          this.message = res.message;
          this.loading = false;
          if (typeof window !== 'undefined')
            {
              localStorage.removeItem('email');
  
            }
          setTimeout(() => this.router.navigate(['/login']), 2000);
        },
        (err) => this.message = err.error?.message || 'Error resetting password'
      );
    }
  }
}
