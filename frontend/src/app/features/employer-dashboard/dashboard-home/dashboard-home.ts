import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { JobService } from '../../../core/services/job.service';

@Component({
  selector: 'app-dashboard-home',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="bg-gray-50 min-h-screen py-12">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center mb-10">
          <div>
            <h1 class="text-4xl font-extrabold text-gray-900">Employer Dashboard</h1>
            <p class="mt-2 text-lg text-gray-600">Manage your job postings and applicants.</p>
          </div>
          <a routerLink="/dashboard/jobs/new" class="px-6 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-200">
            + Post New Job
          </a>
        </div>

        <div *ngIf="loading()" class="flex justify-center py-20">
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>

        <div *ngIf="!loading() && jobs().length === 0" class="bg-white rounded-3xl p-16 text-center border border-gray-100 shadow-sm">
          <div class="text-5xl mb-6">📢</div>
          <h3 class="text-2xl font-bold text-gray-900 mb-2">No jobs posted yet</h3>
          <p class="text-gray-500 mb-8">Start by creating your first job opening to attract top talent.</p>
          <a routerLink="/dashboard/jobs/new" class="inline-block px-8 py-3 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200">
            Post Your First Job
          </a>
        </div>

        <div *ngIf="!loading() && jobs().length > 0" class="grid gap-6">
          <div *ngFor="let job of jobs()" class="bg-white p-6 md:p-8 rounded-3xl border border-gray-100 shadow-xs hover:shadow-md transition-all group">
            <div class="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div class="grow">
                <div class="flex items-center gap-3 mb-2">
                  <span class="px-2 py-0.5 bg-blue-50 text-blue-600 text-[10px] font-bold rounded-full uppercase tracking-wider">
                    {{ job.job_type }}
                  </span>
                  <span class="text-gray-400 text-xs">
                    Posted on {{ job.created_at | date:'mediumDate' }}
                  </span>
                </div>
                <h3 class="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                  {{ job.title }}
                </h3>
                <p class="text-gray-500 text-sm mt-1 mb-4 line-clamp-2">{{ job.description }}</p>
                <div class="flex gap-4 text-sm font-medium text-gray-600">
                   <div class="flex items-center gap-1.5">
                    <span>📍</span> {{ job.location }}
                  </div>
                </div>
              </div>
              
              <div class="flex flex-wrap items-center gap-3 shrink-0">
                <a [routerLink]="['/dashboard/jobs', job.id, 'applicants']" 
                   class="px-4 py-2 bg-indigo-50 text-indigo-700 font-bold rounded-lg hover:bg-indigo-100 transition-all text-sm">
                  View Applicants
                </a>
                <a [routerLink]="['/dashboard/jobs/edit', job.id]" 
                   class="px-4 py-2 bg-gray-50 text-gray-700 font-bold rounded-lg hover:bg-gray-100 transition-all text-sm">
                  Edit
                </a>
                <button (click)="deleteJob(job.id)" 
                        class="px-4 py-2 bg-red-50 text-red-600 font-bold rounded-lg hover:bg-red-100 transition-all text-sm">
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class DashboardHomeComponent implements OnInit {
  jobs = signal<any[]>([]);
  loading = signal<boolean>(true);

  constructor(private jobService: JobService) {}

  ngOnInit(): void {
    this.fetchMyJobs();
  }

  fetchMyJobs(): void {
    this.loading.set(true);
    // The backend filters jobs by employer if we are an employer? 
    // Actually JobViewSet queryset is Job.objects.filter(is_active=True).
    // We might need an endpoint or a filter for "my jobs".
    // Let's re-check JobViewSet.
    this.jobService.getJobs({ my_jobs: 'true' }).subscribe({
      next: (data: any) => {
        const results = Array.isArray(data) ? data : (data.results || []);
        this.jobs.set(results);
        this.loading.set(false);
      },
      error: (err: any) => {
        console.error('Error fetching jobs:', err);
        this.loading.set(false);
      }
    });
  }

  deleteJob(id: number): void {
    if (confirm('Are you sure you want to delete this job?')) {
      this.jobService.deleteJob(id).subscribe({
        next: () => {
          this.jobs.set(this.jobs().filter(j => j.id !== id));
        },
        error: (err: any) => console.error('Error deleting job:', err)
      });
    }
  }
}
