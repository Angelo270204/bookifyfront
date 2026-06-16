import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthStateService } from '../services/auth-state.service';

export const adminGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const authState = inject(AuthStateService);
  
  if (authState.isAdmin()) {
    return true;
  }

  // Si no tiene el rol de admin, redirigir al login
  return router.createUrlTree(['/login']);
};
