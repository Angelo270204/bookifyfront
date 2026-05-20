import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { RegisterFormComponent } from './components/register-form/register-form.component';
import { RegisterHeroComponent } from './components/register-hero/register-hero.component';

@Component({
  selector: 'app-register-page',
  imports: [RegisterHeroComponent, RegisterFormComponent],
  templateUrl: './register-page.component.html',
  styleUrl: './register-page.component.scss'
})
export class RegisterPageComponent {
  private readonly router = inject(Router);

  // CAMBIO EL NOMBRE Y EL DESTINO A /login 
  goToLogin(): void {
    this.router.navigate(['/login']);
  }
}