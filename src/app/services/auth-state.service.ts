import { Injectable, inject } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { AuthService } from '../auth.service';

@Injectable({ providedIn: 'root' })
export class AuthStateService {
  private readonly authService = inject(AuthService);
  private loggedInSubject = new BehaviorSubject<boolean>(this.checkInitialLoginState());
  private emailSubject = new BehaviorSubject<string | null>(localStorage.getItem('bookifyUserEmail'));
  private rolesSubject = new BehaviorSubject<string[]>(this.getInitialRoles());

  isLoggedIn$ = this.loggedInSubject.asObservable();
  email$ = this.emailSubject.asObservable();
  roles$ = this.rolesSubject.asObservable();

  private checkInitialLoginState(): boolean {
    return !!localStorage.getItem('bookifyUserEmail');
  }

  private getInitialRoles(): string[] {
    const rolesStr = localStorage.getItem('bookifyUserRoles');
    if (rolesStr) {
      try {
        return JSON.parse(rolesStr);
      } catch (e) {
        console.error('Error parseando roles', e);
      }
    }
    return [];
  }

  setLoginState(email: string, roles: string[], id: string): void {
    localStorage.setItem('bookifyUserEmail', email);
    localStorage.setItem('bookifyUserRoles', JSON.stringify(roles));
    localStorage.setItem('bookifyUserId', id);

    this.loggedInSubject.next(true);
    this.emailSubject.next(email);
    this.rolesSubject.next(roles);
  }

  logout(): void {
    // Llamar al backend para invalidar la sesión HTTP (eliminar JSESSIONID válida)
    this.authService.logout().subscribe({
      next: () => console.log('Sesión invalidada en el backend'),
      error: (err) => console.error('Error cerrando sesión en backend', err)
    });

    localStorage.removeItem('bookifyUserEmail');
    localStorage.removeItem('bookifyUserRoles');
    localStorage.removeItem('bookifyUserId');

    this.loggedInSubject.next(false);
    this.emailSubject.next(null);
    this.rolesSubject.next([]);
  }

  isAdmin(): boolean {
    return this.rolesSubject.value.some(role => role.includes('ADMIN'));
  }
}
