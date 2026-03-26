import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <nav class="bg-white border-b border-gray-100 sticky top-0 z-50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-16">
          <div class="flex items-center">
            <a routerLink="/" class="shrink-0 flex items-center">
              <span class="text-2xl font-extrabold bg-clip-text text-transparent bg-linear-to-r from-blue-600 to-indigo-600">
                JobPortal
              </span>
            </a>
            <div class="hidden sm:ml-8 sm:flex sm:space-x-8">
              <a routerLink="/jobs" routerLinkActive="text-blue-600 border-blue-600" class="border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors">
                Browse Jobs
              </a>
            </div>
          </div>
          
          <div class="hidden sm:ml-6 sm:flex sm:items-center sm:space-x-4">
            <ng-container *ngIf="!(authService.isAuthenticated | async); else authLinks">
              <a routerLink="/login" class="text-gray-500 hover:text-gray-700 px-3 py-2 rounded-md text-sm font-medium transition-colors">
                Log in
              </a>
              <a routerLink="/register" class="bg-blue-600 text-white hover:bg-blue-700 px-4 py-2 rounded-lg text-sm font-medium transition-all shadow-sm hover:shadow-md">
                Sign up
              </a>
            </ng-container>
            
            <ng-template #authLinks>
              <button (click)="logout()" class="text-gray-500 hover:text-gray-700 px-3 py-2 rounded-md text-sm font-medium transition-colors">
                Logout
              </button>
            </ng-template>
          </div>
        </div>
      </div>
    </nav>
  `
})
export class NavbarComponent {
  constructor(public authService: AuthService) {}

  logout() {
    this.authService.logout();
    window.location.reload();
  }
}
