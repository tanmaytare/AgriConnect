import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ApiService } from '../api.service';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-otp-verification',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './otp-verification.component.html',
  styleUrl: './otp-verification.component.scss'
})
export class OtpVerificationComponent implements OnInit {
  otpForm = new FormGroup({
    otp: new FormControl('', [Validators.required, Validators.minLength(6), Validators.maxLength(6)])
  });

  email!: string;

  constructor(private apiService: ApiService, private authService: AuthService, private router: Router) {}

  ngOnInit() {
    this.email = localStorage.getItem('email') || '';
    if (!this.email) {
      console.log('No email found, redirecting to signup...');
      this.router.navigate(['/signup']);
    }
  }

  onVerifyOtp() {
    if (this.otpForm.valid) {
      this.apiService.verifyOtp(this.email, this.otpForm.value.otp).subscribe(
        (res) => {
          console.log('OTP Verified:', res);
          if (typeof window !== 'undefined')
          {
            localStorage.removeItem('email');

          }
          this.authService.login(res.user.name, res.token, res.refreshToken);
          this.router.navigate(['/dashboard']);
        },
        (err) => console.log('OTP Verification Error:', err)
      );
    } else {
      console.log('Invalid OTP');
    }
  }

  onResendOtp() {
    this.apiService.resendOtp(this.email).subscribe(
      (res) => console.log('OTP Resent:', res),
      (err) => console.log('Resend OTP Error:', err)
    );
  }
  
}
