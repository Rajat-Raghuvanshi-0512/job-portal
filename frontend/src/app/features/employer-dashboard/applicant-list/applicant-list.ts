import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { JobService } from '../../../core/services/job.service';

@Component({
  selector: 'app-applicant-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="bg-gray-50 min-h-screen py-12">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="mb-10">
          <a routerLink="/dashboard" class="text-indigo-600 hover:text-indigo-800 font-bold flex items-center gap-2 mb-4">
            ← Back to Dashboard
          </a>
          <h1 class="text-4xl font-extrabold text-gray-900">Applicants</h1>
          <p *ngIf="jobTitle()" class="mt-2 text-lg text-gray-600">For position: <span class="text-indigo-600 font-bold">{{ jobTitle() }}</span></p>
        </div>

        <div *ngIf="loading()" class="flex justify-center py-20">
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>

        <div *ngIf="!loading() && applicants().length === 0" class="bg-white rounded-3xl p-16 text-center border border-gray-100 shadow-sm">
          <div class="text-5xl mb-6">🤝</div>
          <h3 class="text-2xl font-bold text-gray-900 mb-2">No applicants yet</h3>
          <p class="text-gray-500">Applications will appear here once candidates start applying.</p>
        </div>

        <div *ngIf="!loading() && applicants().length > 0" class="grid gap-4">
          <div *ngFor="let applicant of applicants()" 
               class="bg-white p-6 rounded-2xl border border-gray-100 shadow-xs hover:shadow-md transition-all flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div class="flex items-center gap-6">
              <div class="w-12 h-12 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center font-bold text-xl">
                {{ applicant.applicant_email[0].toUpperCase() }}
              </div>
              <div>
                <h3 class="text-lg font-bold text-gray-900">{{ applicant.applicant_email }}</h3>
                <p class="text-gray-500 text-sm">Applied on {{ applicant.created_at | date:'mediumDate' }}</p>
              </div>
            </div>
            
            <div class="flex items-center gap-6">
              <span [ngClass]="{
                'bg-yellow-50 text-yellow-700': applicant.status === 'APPLIED',
                'bg-blue-50 text-blue-700': applicant.status === 'REVIEWING',
                'bg-indigo-50 text-indigo-700': applicant.status === 'INTERVIEW',
                'bg-green-50 text-green-700': applicant.status === 'ACCEPTED',
                'bg-red-50 text-red-700': applicant.status === 'REJECTED'
              }" class="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                {{ applicant.status }}
              </span>
              <a [routerLink]="['/dashboard/applications', applicant.id]" 
                 class="px-6 py-2 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition-all text-sm shadow-md shadow-indigo-100">
                Review Application
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class ApplicantListComponent implements OnInit {
  applicants = signal<any[]>([]);
  jobTitle = signal<string>('');
  loading = signal<boolean>(true);
  jobId: number | null = null;

  constructor(
    private jobService: JobService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.jobId = +id;
      this.fetchApplicants(this.jobId);
      this.fetchJobTitle(this.jobId);
    }
  }

  fetchApplicants(jobId: number): void {
    this.loading.set(true);
    this.jobService.getApplications({ job: jobId }).subscribe({
      next: (data: any) => {
        const results = Array.isArray(data) ? data : (data.results || []);
        this.applicants.set(results);
        this.loading.set(false);
      },
      error: (err: any) => {
        console.error('Error fetching applicants:', err);
        this.loading.set(false);
      }
    });
  }

  fetchJobTitle(jobId: number): void {
    this.jobService.getJob(jobId).subscribe({
      next: (job: any) => this.jobTitle.set(job.title),
      error: (err: any) => console.error('Error fetching job title:', err)
    });
  }
}
