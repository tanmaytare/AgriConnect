import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ApiService } from '../api.service';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  loading = false;
  loginError = '';

  loginForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(6)])
  });

  constructor(private apiService: ApiService, private authService: AuthService, private router: Router) {}

 
  onLogin() {
    this.loading = true;
    this.loginError = '';

    if (this.loginForm.valid) {
      this.apiService.login(this.loginForm.value).subscribe(
        (res) => {
          this.loading = false;
          console.log('Login Success:', res);
          localStorage.setItem('userId', res.user._id);
          this.authService.login(res.user.name, res.token, res.refreshToken);
          this.router.navigate(['/dashboard']);
        },
        (err) => {
          this.loading = false;
          this.loginError = err.error?.message || 'Login failed. Please try again.';
        }
      );
    } else {
      this.loading = false;
      this.loginError = 'Please enter a valid email and password.';
    }
  }
}
