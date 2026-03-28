import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { JobService } from '../../../core/services/job.service';

@Component({
  selector: 'app-job-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  template: `
    <div class="bg-gray-50 min-h-screen py-12">
      <div class="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="mb-8">
          <a routerLink="/dashboard" class="text-indigo-600 hover:text-indigo-800 font-bold flex items-center gap-2 mb-4">
            ← Back to Dashboard
          </a>
          <h1 class="text-3xl font-extrabold text-gray-900">{{ isEditMode ? 'Edit' : 'Post New' }} Job</h1>
        </div>

        <div class="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
          <form [formGroup]="jobForm" (ngSubmit)="onSubmit()" class="space-y-6">
            <div class="space-y-1">
              <label class="block text-sm font-bold text-gray-700">Job Title</label>
              <input type="text" formControlName="title" placeholder="e.g. Senior Frontend Developer"
                     class="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all">
            </div>

            <div class="space-y-1">
              <label class="block text-sm font-bold text-gray-700">Job Description</label>
              <textarea formControlName="description" rows="6" placeholder="Describe the role, responsibilities, and requirements..."
                        class="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"></textarea>
            </div>

            <div class="grid md:grid-cols-2 gap-6">
              <div class="space-y-1">
                <label class="block text-sm font-bold text-gray-700">Company Name</label>
                <input type="text" formControlName="company_name" placeholder="Your Company"
                       class="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all">
              </div>
              <div class="space-y-1">
                <label class="block text-sm font-bold text-gray-700">Location</label>
                <input type="text" formControlName="location" placeholder="e.g. New York, Remote"
                       class="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all">
              </div>
            </div>

            <div class="grid md:grid-cols-3 gap-6">
               <div class="space-y-1">
                <label class="block text-sm font-bold text-gray-700">Job Type</label>
                <select formControlName="job_type" 
                        class="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all">
                  <option value="FULL_TIME">Full Time</option>
                  <option value="PART_TIME">Part Time</option>
                  <option value="CONTRACT">Contract</option>
                  <option value="FREELANCE">Freelance</option>
                  <option value="REMOTE">Remote</option>
                </select>
              </div>
              <div class="space-y-1">
                <label class="block text-sm font-bold text-gray-700">Salary Min</label>
                <input type="number" formControlName="salary_min" placeholder="50000"
                       class="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all">
              </div>
              <div class="space-y-1">
                <label class="block text-sm font-bold text-gray-700">Salary Max</label>
                <input type="number" formControlName="salary_max" placeholder="80000"
                       class="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all">
              </div>
            </div>

            <div class="pt-4 flex gap-4">
              <button type="submit" [disabled]="loading() || jobForm.invalid"
                      class="flex-1 py-4 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 disabled:opacity-50 transition-all shadow-xl shadow-blue-200">
                {{ loading() ? 'Saving...' : (isEditMode ? 'Update Job' : 'Post Job') }}
              </button>
              <button type="button" routerLink="/dashboard"
                      class="px-8 py-4 bg-gray-100 text-gray-700 font-bold rounded-xl hover:bg-gray-200 transition-all">
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  `
})
export class JobFormComponent implements OnInit {
  jobForm: FormGroup;
  isEditMode = false;
  jobId: number | null = null;
  loading = signal<boolean>(false);

  constructor(
    private fb: FormBuilder,
    private jobService: JobService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.jobForm = this.fb.group({
      title: ['', [Validators.required, Validators.maxLength(255)]],
      description: ['', Validators.required],
      company_name: ['', Validators.required],
      location: ['', Validators.required],
      job_type: ['FULL_TIME', Validators.required],
      salary_min: [null],
      salary_max: [null]
    });
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode = true;
      this.jobId = +id;
      this.fetchJob(this.jobId);
    }
  }

  fetchJob(id: number): void {
    this.loading.set(true);
    this.jobService.getJob(id).subscribe({
      next: (job: any) => {
        this.jobForm.patchValue(job);
        this.loading.set(false);
      },
      error: (err: any) => {
        console.error('Error fetching job:', err);
        this.loading.set(false);
      }
    });
  }

  onSubmit(): void {
    if (this.jobForm.invalid) return;

    this.loading.set(true);
    const jobData = this.jobForm.value;

    if (this.isEditMode && this.jobId) {
      this.jobService.updateJob(this.jobId, jobData).subscribe({
        next: () => {
          this.router.navigate(['/dashboard']);
        },
        error: (err: any) => {
          console.error('Error updating job:', err);
          this.loading.set(false);
        }
      });
    } else {
      this.jobService.createJob(jobData).subscribe({
        next: () => {
          this.router.navigate(['/dashboard']);
        },
        error: (err: any) => {
          console.error('Error creating job:', err);
          this.loading.set(false);
        }
      });
    }
  }
}
