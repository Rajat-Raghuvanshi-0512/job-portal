import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { JobService } from '../../../core/services/job.service';

@Component({
  selector: 'app-applicant-detail',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="bg-gray-50 min-h-screen py-12">
      <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div *ngIf="application()" class="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <a [routerLink]="['/dashboard/jobs', application().job, 'applicants']" 
               class="text-indigo-600 hover:text-indigo-800 font-bold flex items-center gap-2 mb-4">
              ← Back to Applicants
            </a>
            <h1 class="text-4xl font-extrabold text-gray-900">Application Review</h1>
            <p class="mt-2 text-lg text-gray-600">Candidate: <span class="text-gray-900 font-bold">{{ application().applicant_email }}</span></p>
          </div>
          
          <div class="flex items-center gap-4 bg-white p-2 rounded-2xl border border-gray-100 shadow-sm">
            <span class="text-xs font-bold text-gray-500 uppercase px-4">Status:</span>
            <select [value]="application().status" 
                    (change)="updateStatus($any($event.target).value)"
                    class="px-4 py-2 rounded-xl border-none bg-indigo-50 text-indigo-700 font-bold focus:ring-2 focus:ring-indigo-500/20">
              <option value="APPLIED">Applied</option>
              <option value="REVIEWING">Under Review</option>
              <option value="INTERVIEW">Interview Scheduled</option>
              <option value="ACCEPTED">Accepted</option>
              <option value="REJECTED">Rejected</option>
            </select>
          </div>
        </div>

        <div *ngIf="loading()" class="flex justify-center py-20">
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>

        <div *ngIf="!loading() && application()" class="grid gap-8">
          <!-- Main Content -->
          <div class="bg-white p-8 md:p-10 rounded-3xl border border-gray-100 shadow-sm">
            <h2 class="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
              <span class="text-3xl">📝</span> Cover Letter
            </h2>
            <div class="prose max-w-none text-gray-700 leading-relaxed whitespace-pre-wrap">
              {{ application().cover_letter }}
            </div>

            <div *ngIf="application().resume_url" class="mt-12 pt-12 border-t border-gray-100">
               <h2 class="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                <span class="text-3xl">📄</span> Resume
              </h2>
              <a [href]="application().resume_url" target="_blank" 
                 class="inline-flex items-center gap-3 px-6 py-4 bg-indigo-50 text-indigo-700 font-bold rounded-xl hover:bg-indigo-100 transition-all">
                 <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                View Attached Resume
              </a>
            </div>
          </div>

          <!-- Job Info Sidebar/Bottom -->
          <div class="bg-indigo-900 text-white p-8 rounded-3xl shadow-xl shadow-indigo-200">
            <h3 class="text-indigo-300 font-bold uppercase tracking-widest text-xs mb-4">Applied For</h3>
            <h2 class="text-2xl font-bold mb-2">{{ application().job_title }}</h2>
            <p class="text-indigo-200 mb-6">{{ application().company_name }}</p>
            <div class="flex items-center gap-4 text-sm text-indigo-100 bg-indigo-800/50 p-4 rounded-xl">
              <span class="text-xl">📅</span>
              <div>
                <p class="font-bold">Submission Date</p>
                <p>{{ application().created_at | date:'fullDate' }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class ApplicantDetailComponent implements OnInit {
  application = signal<any>(null);
  loading = signal<boolean>(true);

  constructor(
    private jobService: JobService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.fetchApplication(+id);
    }
  }

  fetchApplication(id: number): void {
    this.loading.set(true);
    this.jobService.getApplication(id).subscribe({
      next: (app: any) => {
        this.application.set(app);
        this.loading.set(false);
      },
      error: (err: any) => {
        console.error('Error fetching application:', err);
        this.loading.set(false);
      }
    });
  }

  updateStatus(newStatus: string): void {
    if (!this.application()) return;

    this.jobService.updateApplicationStatus(this.application().id, newStatus).subscribe({
      next: (updatedApp: any) => {
        this.application.set(updatedApp);
      },
      error: (err: any) => console.error('Error updating status:', err)
    });
  }
}
