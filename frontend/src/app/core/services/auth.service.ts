import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Observable, BehaviorSubject, tap } from 'rxjs';
import { ApiService } from './api.service';
import { TokenService } from './token.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<any>(null);
  public currentUser = this.currentUserSubject.asObservable();
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  public isAuthenticated = this.isAuthenticatedSubject.asObservable();
  private isReadySubject = new BehaviorSubject<boolean>(false);
  public isReady = this.isReadySubject.asObservable();

  get isAuthenticatedValue(): boolean {
    return this.isAuthenticatedSubject.value;
  }

  get currentUserValue(): any {
    return this.currentUserSubject.value;
  }

  constructor(
    private apiService: ApiService,
    private tokenService: TokenService,
    @Inject(PLATFORM_ID) private platformId: Object,
  ) {
    this.checkToken();
  }

  private checkToken() {
    console.log('[AuthService] Checking token...', { platform: isPlatformBrowser(this.platformId) ? 'browser' : 'server' });
    if (isPlatformBrowser(this.platformId)) {
      const token = this.tokenService.getToken();
      if (token) {
        console.log('[AuthService] Token found, fetching profile...');
        this.isAuthenticatedSubject.next(true);
        this.getProfile().subscribe({
          next: (user) => {
            console.log('[AuthService] Profile fetched successfully', user.email);
            this.isReadySubject.next(true);
          },
          error: (err) => {
            console.error('[AuthService] Profile fetch failed', err);
            this.isReadySubject.next(true);
          }
        });
      } else {
        console.log('[AuthService] No token found');
        this.isReadySubject.next(true);
      }
    } else {
      this.isReadySubject.next(true);
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
        this.tokenService.saveTokens(data.access, data.refresh);
        this.isAuthenticatedSubject.next(true);
      }),
    );
  }

  logout() {
    this.tokenService.clearTokens();
    this.currentUserSubject.next(null);
    this.isAuthenticatedSubject.next(false);
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
