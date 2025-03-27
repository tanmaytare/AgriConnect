import { CommonModule } from '@angular/common';
import { Component, HostListener, OnInit } from '@angular/core';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { AuthService } from './auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  title = 'frontend';
  isLoggedIn = false;
  userName = '';
  isDropdownOpen = false; // Controls dropdown visibility

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit() {
    this.authService.isLoggedIn$.subscribe(status => this.isLoggedIn = status);
    this.authService.userName$.subscribe(name => this.userName = name);
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/']);
  }

   toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

   // Close dropdown when clicking outside
   @HostListener('document:click', ['$event'])
   closeDropdown(event: Event) {
     const target = event.target as HTMLElement;
     if (!target.closest('.relative')) { 
       this.isDropdownOpen = false;
     }
   }
}
