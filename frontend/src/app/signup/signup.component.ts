import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ApiService } from '../api.service';


@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule,RouterLink],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.scss'
})
export class SignupComponent {

  loading: boolean = false;
  signupError: string = "";
  
  signupForm = new FormGroup({
    name: new FormControl('', [Validators.required, Validators.minLength(3)]),
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(6)])
  });
 

  constructor(private apiService: ApiService, private router: Router) {}

  onSignup() {
    this.loading = true;
    this.signupError = '';
  
    if (this.signupForm.valid) {
      this.apiService.signUp(this.signupForm.value).subscribe(
        (res) => {
          this.loading = false;
          console.log('OTP Sent:', res);
          localStorage.setItem('email', this.signupForm.value.email ?? '');
          this.router.navigate(['/verify-otp']);
        },
        (err) => {
          this.loading = false;
          this.signupError = err.error?.message || 'Signup failed. Please try again.';
        }
      );
    } else {
      this.loading = false;
      this.signupError = 'Please fill all required fields correctly.';
    }
  }
  
}
