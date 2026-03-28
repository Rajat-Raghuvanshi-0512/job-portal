import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { HttpClient, HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class JobService {
  constructor(private apiService: ApiService) {}

  getJobs(params?: any): Observable<any> {
    let httpParams = new HttpParams();
    if (params) {
      Object.keys(params).forEach(key => {
        if (params[key] !== null && params[key] !== undefined) {
          httpParams = httpParams.set(key, params[key]);
        }
      });
    }
    return this.apiService.get('/jobs/', httpParams);
  }

  getJob(id: number): Observable<any> {
    return this.apiService.get(`/jobs/${id}/`);
  }

  createJob(jobData: any): Observable<any> {
    return this.apiService.post('/jobs/', jobData);
  }

  updateJob(id: number, jobData: any): Observable<any> {
    return this.apiService.put(`/jobs/${id}/`, jobData);
  }

  deleteJob(id: number): Observable<any> {
    return this.apiService.delete(`/jobs/${id}/`);
  }

  getApplications(params?: any): Observable<any> {
    let httpParams = new HttpParams();
    if (params) {
      Object.keys(params).forEach(key => {
        if (params[key] !== null && params[key] !== undefined) {
          httpParams = httpParams.set(key, params[key]);
        }
      });
    }
    return this.apiService.get('/jobs/applications/', httpParams);
  }

  getApplication(id: number): Observable<any> {
    return this.apiService.get(`/jobs/applications/${id}/`);
  }

  updateApplicationStatus(id: number, status: string): Observable<any> {
    return this.apiService.patch(`/jobs/applications/${id}/`, { status });
  }

  applyForJob(jobId: number, coverLetter: string, resumeUrl?: string): Observable<any> {
    return this.apiService.post('/jobs/applications/', { 
      job: jobId, 
      cover_letter: coverLetter,
      resume_url: resumeUrl
    });
  }
}
