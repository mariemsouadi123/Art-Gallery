import { inject } from '@angular/core';
import { CanActivateFn, Router, UrlTree } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { map } from 'rxjs';

export const authGuard: CanActivateFn = (route) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return authService.getCurrentUserObservable().pipe(
    map(user => {
      if (!user) {
        return router.createUrlTree(['/login']);
      }

      // Check if route requires specific role
      const requiredRole = route.data?.['role'];
      if (requiredRole && user.role !== requiredRole) {
        // Redirect to appropriate dashboard if wrong role
        return router.createUrlTree([user.role === 'ADMIN' ? '/admin-dashboard' : '/user-home']);
      }

      return true;
    })
  );
};