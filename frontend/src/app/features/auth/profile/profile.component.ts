import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="min-h-screen bg-gray-50 pb-12">
      <!-- Cover Header -->
      <div class="h-64 bg-linear-to-r from-blue-600 to-indigo-700 relative shadow-inner">
        <div class="absolute -bottom-16 left-1/2 -translate-x-1/2 md:left-auto md:translate-x-0 md:ml-12">
          <div class="w-32 h-32 rounded-3xl bg-white p-2 shadow-2xl">
            <div class="w-full h-full rounded-2xl bg-linear-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-5xl font-black">
              {{ (authService.currentUser | async)?.first_name?.[0]?.toUpperCase() }}
            </div>
          </div>
        </div>
      </div>

      <div class="max-w-4xl mx-auto px-4 mt-20">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <!-- Main Content Card -->
          <div class="md:col-span-2 space-y-6">
            <div class="bg-white rounded-3xl p-8 shadow-xs border border-gray-100">
              <div class="flex justify-between items-start mb-8">
                <div>
                  <h1 class="text-3xl font-black text-gray-900 leading-tight">
                    {{ (authService.currentUser | async)?.first_name }} {{ (authService.currentUser | async)?.last_name }}
                  </h1>
                  <p class="text-blue-600 font-bold flex items-center gap-2 mt-1">
                    <span class="p-1 px-2.5 bg-blue-50 rounded-lg text-xs uppercase tracking-widest">{{ (authService.currentUser | async)?.role }}</span>
                    <span class="text-gray-400">•</span>
                    <span class="text-gray-500 text-sm font-medium">{{ (authService.currentUser | async)?.location || 'Location not specified' }}</span>
                  </p>
                </div>
              </div>

              <div class="space-y-6">
                <div>
                  <h2 class="text-xs font-black text-gray-400 uppercase tracking-widest mb-3">About Me</h2>
                  <p class="text-gray-600 leading-relaxed font-medium">
                    {{ (authService.currentUser | async)?.bio || 'No bio provided yet. Add a few sentences about yourself to stand out!' }}
                  </p>
                </div>

                <div class="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-6 border-t border-gray-50">
                  <div>
                    <h3 class="text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Email Address</h3>
                    <p class="text-gray-900 font-bold truncate">{{ (authService.currentUser | async)?.email }}</p>
                  </div>
                  <div>
                    <h3 class="text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Phone Number</h3>
                    <p class="text-gray-900 font-bold">{{ (authService.currentUser | async)?.phone || 'Not provided' }}</p>
                  </div>
                </div>
              </div>
            </div>

            <!-- Additional Stats/Info Card -->
            <div class="bg-white rounded-3xl p-8 shadow-xs border border-gray-100">
              <h2 class="text-xs font-black text-gray-400 uppercase tracking-widest mb-6">Account Activity</h2>
              <div class="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl border border-gray-100">
                <div class="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center text-2xl">📅</div>
                <div>
                  <p class="text-xs font-bold text-gray-400 uppercase tracking-wider">Member Since</p>
                  <p class="text-sm font-black text-gray-900">
                    {{ (authService.currentUser | async)?.date_joined | date:'longDate' }}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <!-- Sidebar -->
          <div class="space-y-6">
            <div class="bg-white rounded-3xl p-6 shadow-xs border border-gray-100">
              <h3 class="text-xs font-black text-gray-400 uppercase tracking-widest mb-4">Verification</h3>
              <div class="space-y-3">
                <div class="flex items-center gap-2.5 text-sm font-bold text-green-600 bg-green-50 p-3 rounded-xl border border-green-100">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                  </svg>
                  Email Verified
                </div>
                <div class="flex items-center gap-2.5 text-sm font-bold text-blue-600 bg-blue-50 p-3 rounded-xl border border-blue-100">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                  </svg>
                  Profile Active
                </div>
              </div>
            </div>

            <button class="w-full bg-linear-to-r from-gray-900 to-gray-800 text-white font-black py-4 rounded-2xl shadow-xl shadow-gray-200 hover:-translate-y-0.5 transition-all">
              Edit Profile
            </button>
          </div>
        </div>
      </div>
    </div>
  `
})
export class ProfileComponent {
  authService = inject(AuthService);
}
