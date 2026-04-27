import { inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Router, CanActivateFn, ActivatedRouteSnapshot } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { APP_PATHS } from '../constants/app.constants';

export const roleGuard: CanActivateFn = (route: ActivatedRouteSnapshot) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const platformId = inject(PLATFORM_ID);

  // En SSR no hay localStorage: dejar pasar y el cliente revalida
  if (!isPlatformBrowser(platformId)) {
    return true;
  }

  const requiredRole = route.data['role'];
  const userRole = authService.getUserRole();

  if (userRole === requiredRole) {
    return true;
  }

  router.navigate([`/${APP_PATHS.LOGIN}`]);
  return false;
};
