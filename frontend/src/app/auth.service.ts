import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private isLoggedInSubject = new BehaviorSubject<boolean>(false);
  private userNameSubject = new BehaviorSubject<string>('');

  isLoggedIn$ = this.isLoggedInSubject.asObservable();
  userName$ = this.userNameSubject.asObservable();

  constructor() {
    this.loadUserData();
  }

  private loadUserData() {
    if (typeof window !== 'undefined') { // ✅ Ensures code runs only in the browser
      const token = localStorage.getItem('token');
      const userName = localStorage.getItem('userName') || '';

      this.isLoggedInSubject.next(!!token);
      this.userNameSubject.next(userName);
    }
  }

  login(userName: string, token: string, refreshToken: string) {
    if (typeof window !== 'undefined') {
      localStorage.setItem('userName', userName);
      localStorage.setItem('token', token);
      localStorage.setItem('refreshToken', refreshToken);

      this.isLoggedInSubject.next(true);
      this.userNameSubject.next(userName);
    }
  }

  logout() {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('userName');
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('userId');

      this.isLoggedInSubject.next(false);
      this.userNameSubject.next('');
    }
  }
}
