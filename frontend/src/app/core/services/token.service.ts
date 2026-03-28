import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TokenService {
  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  getToken(): string | null {
    if (isPlatformBrowser(this.platformId)) {
      return localStorage.getItem('token');
    }
    return null;
  }

  getRefreshToken(): string | null {
    if (isPlatformBrowser(this.platformId)) {
      return localStorage.getItem('refresh_token');
    }
    return null;
  }

  saveTokens(access: string, refresh?: string) {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('token', access);
      if (refresh) {
        localStorage.setItem('refresh_token', refresh);
      }
    }
  }

  clearTokens() {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('token');
      localStorage.removeItem('refresh_token');
    }
  }

  async refreshToken(): Promise<string | null> {
    const refresh = this.getRefreshToken();
    if (!refresh) return null;

    try {
      const response = await fetch(`${environment.apiUrl}/token/refresh/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refresh })
      });

      if (response.ok) {
        const data = await response.json();
        this.saveTokens(data.access, data.refresh);
        return data.access;
      }
    } catch (error) {
      console.error('[TokenService] Refresh failed', error);
    }
    return null;
  }
}
