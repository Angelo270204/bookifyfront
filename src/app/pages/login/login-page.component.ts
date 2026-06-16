import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoginFormComponent } from './components/login-form/login-form.component';
import { LoginHeroComponent } from './components/login-hero/login-hero.component';
import { AuthStateService } from '../../services/auth-state.service';

@Component({
  selector: 'app-login-page',
  imports: [LoginHeroComponent, LoginFormComponent],
  templateUrl: './login-page.component.html',
  styleUrl: './login-page.component.scss'
})
export class LoginPageComponent implements OnInit {
  private readonly router = inject(Router);
  private readonly authState = inject(AuthStateService);

  ngOnInit(): void {
    // Al entrar al login, nos aseguramos de limpiar cualquier sesión anterior de forma global
    this.authState.logout();
  }

  handleLoginSuccess(roles: string[]): void {
    // La sesión real se guarda ahora dentro del login-form component que es donde tenemos el email y token,
    // o podemos inyectar AuthStateService ahí. Wait! En `handleLoginSuccess` recibimos roles pero no el email.
    // Veamos cómo funciona LoginFormComponent.
    // De hecho, en lugar de manejar el setLoginState aquí, si solo recibimos `roles`, debemos asegurarnos de que login-form llame a authState.
    
    if (roles && roles.some(role => role.includes('ADMIN'))) {
      this.router.navigate(['/admin']);
    } else {
      this.router.navigate(['/home']);
    }
  }
}
