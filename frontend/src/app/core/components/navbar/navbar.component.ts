import { Component, signal, HostListener, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <nav class="bg-white border-b border-gray-100 sticky top-0 z-50 shadow-xs">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-20">
          <div class="flex items-center">
            <a routerLink="/" class="shrink-0 flex items-center group">
              <span class="text-3xl font-black bg-clip-text text-transparent bg-linear-to-r from-blue-600 to-indigo-600 group-hover:from-indigo-600 group-hover:to-blue-600 transition-all duration-500">
                JobPortal
              </span>
            </a>
            <div class="hidden sm:ml-10 sm:flex sm:space-x-8">
              <a routerLink="/jobs" routerLinkActive="text-blue-600 font-bold" [routerLinkActiveOptions]="{exact: true}"
                 class="text-gray-500 hover:text-blue-600 inline-flex items-center px-1 pt-1 text-sm font-semibold transition-all duration-300">
                Browse Jobs
              </a>
            </div>
          </div>
          
          <div class="hidden sm:ml-6 sm:flex sm:items-center sm:space-x-4">
            <ng-container *ngIf="!(authService.isAuthenticated | async); else authLinks">
              <a routerLink="/login" class="text-gray-600 hover:text-blue-600 px-4 py-2 rounded-xl text-sm font-bold transition-all duration-300">
                Log in
              </a>
              <a routerLink="/register" class="bg-indigo-600 text-white hover:bg-indigo-700 px-6 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 shadow-lg shadow-indigo-100 hover:-translate-y-0.5">
                Get Started
              </a>
            </ng-container>
            
            <ng-template #authLinks>
              <div class="relative" #dropdownContainer>
                <!-- Avatar Button -->
                <button (click)="toggleDropdown()" 
                        class="flex items-center gap-2.5 p-1.5 pr-3 rounded-2xl hover:bg-gray-50 transition-all duration-300 border border-transparent hover:border-gray-100 group">
                  <div class="w-10 h-10 rounded-xl bg-linear-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-black text-lg shadow-md group-hover:shadow-indigo-200 transition-all">
                    {{ getUserInitial() }}
                  </div>
                  <div class="text-left hidden lg:block">
                    <p class="text-xs font-black text-gray-900 leading-tight">{{ (authService.currentUser | async)?.first_name }}</p>
                    <p class="text-[10px] font-bold text-gray-400 uppercase tracking-wider">{{ (authService.currentUser | async)?.role }}</p>
                  </div>
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-gray-400 group-hover:text-gray-600 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                <!-- Dropdown Menu -->
                <div *ngIf="showDropdown()" 
                     class="absolute right-0 mt-3 w-56 bg-white rounded-2xl shadow-2xl border border-gray-100 py-2 z-50 origin-top-right animate-in fade-in zoom-in duration-200">
                  <div class="px-4 py-3 border-b border-gray-50 mb-1">
                    <p class="text-xs font-bold text-gray-400 uppercase tracking-widest mb-0.5">Signed in as</p>
                    <p class="text-sm font-bold text-gray-900 truncate">{{ (authService.currentUser | async)?.email }}</p>
                  </div>

                  <a *ngIf="(authService.currentUser | async)?.role === 'EMPLOYER'" 
                     routerLink="/dashboard" (click)="showDropdown.set(false)"
                     class="flex items-center gap-3 px-4 py-2.5 text-sm font-bold text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-all">
                    <span class="text-lg">📊</span> Dashboard
                  </a>
                  
                  <a routerLink="/profile" (click)="showDropdown.set(false)"
                     class="flex items-center gap-3 px-4 py-2.5 text-sm font-bold text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-all">
                    <span class="text-lg">👤</span> My Profile
                  </a>

                  <div class="border-t border-gray-50 mt-1 pt-1">
                    <button (click)="logout()" 
                            class="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-bold text-red-600 hover:bg-red-50 transition-all">
                      <span class="text-lg">🚪</span> Sign Out
                    </button>
                  </div>
                </div>
              </div>
            </ng-template>
          </div>
        </div>
      </div>
    </nav>
  `
})
export class NavbarComponent {
  showDropdown = signal(false);

  @ViewChild('dropdownContainer') dropdownContainer!: ElementRef;

  constructor(public authService: AuthService) {}

  toggleDropdown() {
    this.showDropdown.update(v => !v);
  }

  getUserInitial(): string {
    const user = this.authService.currentUserValue || {};
    return user.first_name ? user.first_name[0].toUpperCase() : '?';
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    if (this.dropdownContainer && !this.dropdownContainer.nativeElement.contains(event.target)) {
      this.showDropdown.set(false);
    }
  }

  logout() {
    this.showDropdown.set(false);
    this.authService.logout();
    window.location.reload();
  }
}
