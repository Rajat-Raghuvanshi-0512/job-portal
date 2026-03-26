import { Component, OnInit, Inject, PLATFORM_ID, signal } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ApiService } from '../../../core/services/api.service';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-job-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="bg-gray-50 min-h-screen py-12">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <!-- Header -->
        <div class="mb-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div>
            <h1 class="text-4xl font-extrabold text-gray-900 tracking-tight">Available Positions</h1>
            <p class="mt-2 text-lg text-gray-600 font-medium">Find your next career move among our curated opportunities.</p>
          </div>
          <div class="flex items-center gap-3">
            <span class="text-sm font-semibold text-gray-500 bg-white px-4 py-2 rounded-full border border-gray-100 shadow-sm">
              {{ jobs().length }} Jobs Found
            </span>
          </div>
        </div>

        <!-- Job Grid -->
        <div class="grid gap-6">
          <div *ngIf="loading()" class="flex justify-center py-20">
            <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>

          <div *ngIf="!loading() && jobs().length === 0" class="bg-white rounded-3xl p-16 text-center border border-gray-100 shadow-sm">
            <div class="text-5xl mb-6">🔍</div>
            <h3 class="text-2xl font-bold text-gray-900 mb-2">No jobs matched your search</h3>
            <p class="text-gray-500">Check back later or try adjusting your filters.</p>
          </div>

          <div *ngFor="let job of jobs()" 
               class="bg-white p-6 md:p-8 rounded-3xl border border-gray-100 shadow-xs hover:shadow-xl hover:shadow-indigo-500/5 transition-all duration-300 group">
            <div class="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div class="grow">
                <div class="flex items-center gap-3 mb-3">
                  <span class="px-3 py-1 bg-blue-50 text-blue-600 text-xs font-bold rounded-full uppercase tracking-wider">
                    {{ job.job_type }}
                  </span>
                  <span class="text-gray-400 text-xs font-medium">
                    Posted {{ job.created_at | date:'mediumDate' }}
                  </span>
                </div>
                <h3 class="text-2xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors mb-2">
                  {{ job.title }}
                </h3>
                <div class="flex flex-wrap items-center gap-x-6 gap-y-2 text-gray-600 font-medium">
                  <div class="flex items-center gap-2">
                    <span class="text-lg">🏢</span>
                    {{ job.company_name }}
                  </div>
                  <div class="flex items-center gap-2">
                    <span class="text-lg">📍</span>
                    {{ job.location }}
                  </div>
                  <div *ngIf="job.salary_min && job.salary_max" class="flex items-center gap-2">
                    <span class="text-lg">💰</span>
                    \${{ job.salary_min }} - \${{ job.salary_max }}
                  </div>
                </div>
              </div>
              
              <div class="flex items-center gap-3 shrink-0">
                <button (click)="apply(job)" 
                        class="w-full md:w-auto px-8 py-3 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200">
                  Apply Now
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class JobListComponent implements OnInit {
  jobs = signal<any[]>([]);
  loading = signal<boolean>(true);

  constructor(
    private apiService: ApiService,
    public authService: AuthService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.fetchJobs();
    }
  }

  fetchJobs(): void {
    this.loading.set(true);
    this.apiService.get('/jobs/').subscribe({
      next: (data) => {
        const results = Array.isArray(data) ? data : (data.results || []);
        this.jobs.set(results);
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Error fetching jobs:', err);
        this.loading.set(false);
      }
    });
  }

  apply(job: any): void {
    if (!this.authService.isAuthenticatedValue) {
      alert('Please log in to apply for jobs.');
      return;
    }

    const coverLetter = prompt('Please enter your cover letter:');
    if (!coverLetter) return;

    this.apiService.post('/jobs/applications/', { 
      job: job.id, 
      cover_letter: coverLetter 
    }).subscribe({
      next: () => {
        alert('Application submitted successfully!');
      },
      error: (err) => {
        console.error('Error applying for job:', err);
        alert(err.detail || 'Failed to submit application. You might have already applied for this job.');
      }
    });
  }
}
