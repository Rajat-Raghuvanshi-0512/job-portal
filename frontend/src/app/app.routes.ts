import { Routes } from '@angular/router';
import { LoginComponent } from './features/auth/login/login.component';
import { RegisterComponent } from './features/auth/register/register.component';
import { HomeComponent } from './features/jobs/home.component';
import { JobListComponent } from './features/jobs/job-list/job-list.component';
import { DashboardHomeComponent } from './features/employer-dashboard/dashboard-home/dashboard-home';
import { JobFormComponent } from './features/employer-dashboard/job-form/job-form';
import { ApplicantListComponent } from './features/employer-dashboard/applicant-list/applicant-list';
import { ApplicantDetailComponent } from './features/employer-dashboard/applicant-detail/applicant-detail';
import { ProfileComponent } from './features/auth/profile/profile.component';
import { authGuard, guestGuard, employerGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  { path: 'login', component: LoginComponent, canActivate: [guestGuard] },
  { path: 'register', component: RegisterComponent, canActivate: [guestGuard] },
  { path: 'profile', component: ProfileComponent, canActivate: [authGuard] },
  { 
    path: 'dashboard', 
    canActivate: [authGuard, employerGuard],
    children: [
      { path: '', component: DashboardHomeComponent },
      { path: 'jobs/new', component: JobFormComponent },
      { path: 'jobs/edit/:id', component: JobFormComponent },
      { path: 'jobs/:id/applicants', component: ApplicantListComponent },
      { path: 'applications/:id', component: ApplicantDetailComponent },
    ]
  },
  { path: 'jobs', component: JobListComponent },
  { path: '', component: HomeComponent },
  { path: '**', redirectTo: '' }
];
