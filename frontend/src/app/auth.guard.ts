import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  console.log(token);
  if (!token) {
    router.navigate(['/login']);
    return false;
  }
  
  return true;
};