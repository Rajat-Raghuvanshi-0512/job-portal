import { inject, PLATFORM_ID } from '@angular/core';
import { isPlatformServer } from '@angular/common';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { map, take, switchMap, filter } from 'rxjs';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const platformId = inject(PLATFORM_ID);

  if (isPlatformServer(platformId)) {
    return true;
  }

  return authService.isReady.pipe(
    filter(ready => ready === true),
    take(1),
    switchMap(() => authService.isAuthenticated.pipe(
      take(1),
      map(isAuthenticated => {
        if (isAuthenticated) {
          return true;
        }
        router.navigate(['/login']);
        return false;
      })
    ))
  );
};

export const guestGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const platformId = inject(PLATFORM_ID);

  if (isPlatformServer(platformId)) {
    return true;
  }

  return authService.isReady.pipe(
    filter(ready => ready === true),
    take(1),
    switchMap(() => authService.isAuthenticated.pipe(
      take(1),
      map(isAuthenticated => {
        if (isAuthenticated) {
          router.navigate(['/']);
          return false;
        }
        return true;
      })
    ))
  );
};

export const employerGuard: CanActivateFn = (route, state) => {
    const authService = inject(AuthService);
    const router = inject(Router);
    const platformId = inject(PLATFORM_ID);
  
    if (isPlatformServer(platformId)) {
      return true;
    }

    return authService.isReady.pipe(
      filter(ready => ready === true),
      take(1),
      switchMap(() => authService.currentUser.pipe(
        take(1),
        map(user => {
          if (user && user.role === 'EMPLOYER') {
            return true;
          }
          router.navigate(['/']);
          return false;
        })
      ))
    );
  };
