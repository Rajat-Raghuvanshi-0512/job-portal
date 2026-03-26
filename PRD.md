# Product Requirements Document (PRD) - Job Portal

## 1. Project Overview
The Job Portal is a web application designed to connect Job Seekers with Employers. It provides a platform for employers to post job openings and for candidates to search and apply for jobs.

## 2. Objectives
- Streamline the job search process for candidates.
- Provide a robust management tool for employers to track applications.
- Ensure a high-performance, secure, and modern user experience.

## 3. User Personas
### 3.1 Job Seeker
- Search for jobs by keywords, location, and category.
- Build and maintain a digital profile/resume.
- Apply for jobs and track application status.

### 3.2 Employer
- Create and manage company profiles.
- Post, edit, and close job listings.
- Review applications and update candidate status.

### 3.3 Admin
- Oversee platform activities.
- Moderate job listings and user accounts.

## 4. Functional Requirements
- **Authentication**: JWT-based login, registration with role selection (Seeker/Employer).
- **Profile Management**: Profile editing, resume upload (Seeker), company details (Employer).
- **Job Management**: CRUD operations for job posts.
- **Search & Filter**: Keyword search, filters for job type, salary range, and location.
- **Application System**: One-click apply for seekers; application dashboard for employers.
- **Notifications**: Email alerts for application status changes.

## 5. Technical Stack
- **Backend**: Python 3.x, Django 5.x, Django REST Framework (DRF).
- **Frontend**: Angular (latest), RxJS, Vanilla CSS.
- **Database**: PostgreSQL.
- **Security**: JWT Authentication (SimpleJWT), CORS headers.
- **Deployment**: Dockerized services (suggested for later).

## 6. Implementation Phases
1. **Foundation**: Setup Django and Angular boilerplate.
2. **Auth & Profiles**: Implement user roles and authentication.
3. **Core Features**: Job postings and search functionality.
4. **Application Logic**: Real-time status updates and submission flow.
5. **Polishing**: UI/UX enhancements and final testing.
