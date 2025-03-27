import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { HttpRequest, HttpHandlerFn } from '@angular/common/http';
import { Observable, catchError, switchMap, throwError } from 'rxjs';
import { ApiService } from '../api.service';

export const tokenInterceptor: HttpInterceptorFn = (req, next) => {
  if (req.url.includes('openweathermap')) {
    return next(req);
  }
  const apiService = inject(ApiService);

  // Check if the window object is available (i.e., running in the browser)
  let token = null;
  if (typeof window !== 'undefined') {
    token = localStorage.getItem('token');
  }

  // Skip adding Authorization header for Cloudinary and Stripe URLs
  if (req.url.includes('cloudinary.com') || req.url.includes('stripe')) {
    return next(req);
  }

  let authReq = req;
  if (token) {
    authReq = req.clone({ setHeaders: { Authorization: `Bearer ${token}` } });
  }

  return next(authReq).pipe(
    catchError((error) => {
      if (error.status === 403) {
        return apiService.refreshToken().pipe(
          switchMap((res: any) => {
            console.log('New Token:', res.token);

            // Only set the token in localStorage if we're in the browser
            if (typeof window !== 'undefined') {
              localStorage.setItem('token', res.token);
            }

            // Retry original request with new token
            const newAuthReq = req.clone({
              setHeaders: { Authorization: `Bearer ${res.token}` },
            });
            return next(newAuthReq);
          }),
          catchError(() => {
            console.error('Refresh Token Failed! Logging Out...');
            apiService.logout();
            return throwError(() => new Error('Session expired. Please log in again.'));
          })
        );
      }
      return throwError(() => new Error(error.message));
    })
  );
};
