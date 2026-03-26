import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Observable, BehaviorSubject, tap } from 'rxjs';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<any>(null);
  public currentUser = this.currentUserSubject.asObservable();
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  public isAuthenticated = this.isAuthenticatedSubject.asObservable();

  get isAuthenticatedValue(): boolean {
    return this.isAuthenticatedSubject.value;
  }

  constructor(
    private apiService: ApiService,
    @Inject(PLATFORM_ID) private platformId: Object,
  ) {
    this.checkToken();
  }

  private checkToken() {
    if (isPlatformBrowser(this.platformId)) {
      const token = localStorage.getItem('token');
      if (token) {
        this.isAuthenticatedSubject.next(true);
        // Optional: Load profile if token exists
        // this.getProfile().subscribe();
      }
    }
  }

  register(credentials: any): Observable<any> {
    return this.apiService.post('/users/register/', credentials);
  }

  login(credentials: any): Observable<any> {
    const payload = {
      email: credentials.email,
      password: credentials.password,
    };
    return this.apiService.post('/token/', payload).pipe(
      tap((data) => {
        this.saveToken(data.access, data.refresh);
        this.isAuthenticatedSubject.next(true);
      }),
    );
  }

  logout() {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('token');
      localStorage.removeItem('refresh_token');
    }
    this.currentUserSubject.next(null);
    this.isAuthenticatedSubject.next(false);
  }

  saveToken(token: string, refresh: string) {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('token', token);
      localStorage.setItem('refresh_token', refresh);
    }
  }

  getToken(): string | null {
    if (isPlatformBrowser(this.platformId)) {
      return localStorage.getItem('token');
    }
    return null;
  }

  getProfile(): Observable<any> {
    return this.apiService
      .get('/users/profile/')
      .pipe(tap((user) => this.currentUserSubject.next(user)));
  }

  getRole(): string | null {
    const user = this.currentUserSubject.value;
    return user ? user.role : null;
  }
}
