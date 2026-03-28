import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { AuthService } from '../../core/services/auth.service';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="flex flex-col overflow-x-hidden">
      <!-- Hero Section -->
      <section class="relative min-h-[90vh] flex items-center bg-indigo-950 overflow-hidden">
        <!-- Background Overlay with Image -->
        <div class="absolute inset-0 z-0 opacity-40">
          <img src="/Users/rajatraghuvanshi/.gemini/antigravity/brain/100306c6-51f2-4073-ab29-ed3f2591b818/job_portal_hero_1774509044342.png" 
               alt="Hero Background" class="w-full h-full object-cover">
          <div class="absolute inset-0 bg-linear-to-b from-indigo-950/50 to-indigo-950"></div>
        </div>

        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
          <div class="lg:w-2/3">
            <h1 class="text-5xl lg:text-7xl font-extrabold text-white tracking-tight leading-[1.1] mb-6">
              Elevate Your <br>
              <span class="text-transparent bg-clip-text bg-linear-to-r from-blue-400 to-emerald-400">Career Journey</span>
            </h1>
            <p class="mt-4 text-xl text-indigo-100 max-w-2xl leading-relaxed mb-10">
              Connect with top-tier companies and talented professionals globally. 
              Find your next major opportunity or post a new opening within minutes.
            </p>
            <div class="flex flex-wrap gap-4">
              <a routerLink="/jobs" class="inline-flex items-center px-8 py-4 bg-blue-600 text-white rounded-xl text-lg font-semibold transition-all hover:bg-blue-700 hover:scale-105 shadow-xl hover:shadow-blue-500/25">
                Browse Jobs
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clip-rule="evenodd" />
                </svg>
              </a>
              <a *ngIf="!(authService.isAuthenticated | async)" routerLink="/register" class="inline-flex items-center px-8 py-4 bg-white/10 text-white border border-white/20 rounded-xl text-lg font-semibold backdrop-blur-md transition-all hover:bg-white/20">
                Join Now
              </a>
            </div>
          </div>
        </div>
      </section>

      <!-- Benefits / How it Works Section -->
      <section class="py-24 bg-white">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="text-center mb-20">
            <h2 class="text-blue-600 font-bold uppercase tracking-widest text-sm mb-4">Why Choose Us</h2>
            <p class="text-4xl font-extrabold text-gray-900 sm:text-5xl">The smarter way to <span class="text-indigo-600">get hired</span></p>
          </div>

          <div class="grid md:grid-cols-3 gap-12">
            <div class="group p-8 bg-gray-50 rounded-3xl transition-all hover:bg-indigo-600 hover:-translate-y-2 duration-300">
              <div class="w-14 h-14 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-white/20 group-hover:text-white transition-colors text-2xl">
                🌐
              </div>
              <h3 class="text-2xl font-bold text-gray-900 group-hover:text-white mb-4">Global Reach</h3>
              <p class="text-gray-600 group-hover:text-indigo-100 leading-relaxed">
                Connect with employers from all over the world. Remote or on-site, find what fits your lifestyle.
              </p>
            </div>

            <div class="group p-8 bg-gray-50 rounded-3xl transition-all hover:bg-emerald-600 hover:-translate-y-2 duration-300">
              <div class="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-white/20 group-hover:text-white transition-colors text-2xl">
                ⚡
              </div>
              <h3 class="text-2xl font-bold text-gray-900 group-hover:text-white mb-4">Real-time Alerts</h3>
              <p class="text-gray-600 group-hover:text-emerald-50 leading-relaxed">
                Get notified the second a job matching your criteria is posted. Never miss an opportunity again.
              </p>
            </div>

            <div class="group p-8 bg-gray-50 rounded-3xl transition-all hover:bg-blue-600 hover:-translate-y-2 duration-300">
              <div class="w-14 h-14 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-white/20 group-hover:text-white transition-colors text-2xl">
                🛡️
              </div>
              <h3 class="text-2xl font-bold text-gray-900 group-hover:text-white mb-4">Verified Employers</h3>
              <p class="text-gray-600 group-hover:text-blue-50 leading-relaxed">
                We verify every company on our platform to ensure you're applying to legitimate openings.
              </p>
            </div>
          </div>
        </div>
      </section>

      <!-- CTA Section -->
      <section class="py-20 bg-linear-to-br from-blue-600 to-indigo-700 relative overflow-hidden">
        <div class="absolute inset-0 bg-indigo-900 opacity-20 pointer-events-none"></div>
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <h2 class="text-4xl font-extrabold text-white mb-8">Ready to take the next step in your career?</h2>
          <div class="flex justify-center gap-6">
            <a *ngIf="!(authService.isAuthenticated | async); else dashboardCTA" routerLink="/register" class="px-10 py-4 bg-white text-blue-600 rounded-xl font-bold text-lg hover:bg-gray-100 transition-all shadow-xl">
              Create Profile
            </a>
            <ng-template #dashboardCTA>
              <a routerLink="/jobs" class="px-10 py-4 bg-white text-blue-600 rounded-xl font-bold text-lg hover:bg-gray-100 transition-all shadow-xl">
                Explore Jobs
              </a>
            </ng-template>
            <a routerLink="/jobs" class="px-10 py-4 bg-transparent border-2 border-white text-white rounded-xl font-bold text-lg hover:bg-white/10 transition-all">
              See All Jobs
            </a>
          </div>
        </div>
      </section>
      
      <!-- Footer -->
      <footer class="py-12 bg-gray-900 border-t border-gray-800">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span class="text-2xl font-extrabold bg-clip-text text-transparent bg-linear-to-r from-blue-400 to-indigo-400">
            JobPortal
          </span>
          <p class="mt-4 text-gray-500 text-sm italic">
            Empowering careers, connecting talent globally.
          </p>
          <div class="mt-8 pt-8 border-t border-gray-800 text-gray-600 text-xs">
            © 2026 JobPortal Inc. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  `
})
export class HomeComponent implements OnInit {
  constructor(
    public authService: AuthService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit(): void {}

  logout() {
    this.authService.logout();
  }
}
