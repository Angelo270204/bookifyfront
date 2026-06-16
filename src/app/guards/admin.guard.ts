import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const adminGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const rolesStr = localStorage.getItem('bookifyUserRoles');
  
  if (rolesStr) {
    try {
      const roles: string[] = JSON.parse(rolesStr);
      if (roles.some(role => role.includes('ADMIN'))) {
        return true;
      }
    } catch (e) {
      console.error('Error al analizar los roles desde localStorage', e);
    }
  }

  // Si no tiene el rol de admin, redirigir al login
  return router.createUrlTree(['/login']);
};
