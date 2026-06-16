import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { LoginFormComponent } from './components/login-form/login-form.component';
import { LoginHeroComponent } from './components/login-hero/login-hero.component';

@Component({
  selector: 'app-login-page',
  imports: [LoginHeroComponent, LoginFormComponent],
  templateUrl: './login-page.component.html',
  styleUrl: './login-page.component.scss'
})
export class LoginPageComponent {
  private readonly router = inject(Router);

  handleLoginSuccess(roles: string[]): void {
    if (roles && roles.some(role => role.includes('ADMIN'))) {
      this.router.navigate(['/admin']);
    } else {
      this.router.navigate(['/home']);
    }
  }
}
