import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private apiUrl = 'http://localhost:5000';

  constructor(private http: HttpClient) {}

  // ============================
  // AUTHENTICATION API
  // ============================

  signUp(user: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/signup`, user);
  }

  verifyOtp(email: any, otp: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/verify-otp`, { email, otp });
  }

  login(user: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, user);
  }

  refreshToken(): Observable<any> {
    const refreshToken = localStorage.getItem('refreshToken');
    console.log('Trying Refresh Token:', refreshToken);
  
    return this.http.post(`http://localhost:5000/refresh`, { refreshToken }).pipe(
      tap((response: any) => {
        console.log('New Token Received:', response.token);
        if (response.token) {
          localStorage.setItem('token', response.token);
        }
      }),
      catchError((error) => {
        console.error('Refresh Token API Error:', error);
        return throwError(() => new Error('Refresh Token Failed'));
      })
    );
  }

  forgotPassword(email: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/forgot-password`, { email });
  }
  
  resetPassword(email: any, otp: any, newPassword: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/reset-password`, { email, otp, newPassword });
  }
  
  resendOtp(email: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/resend-otp`, { email });
  }
  
  

  logout(): void {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('userName');
  }

 
}
