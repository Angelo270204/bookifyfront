import { Component, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthStateService } from '../../services/auth-state.service';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './admin-layout.component.html',
  styleUrl: './admin-layout.component.scss'
})
export class AdminLayoutComponent {
  private readonly router = inject(Router);
  private readonly authState = inject(AuthStateService);

  // Leer el correo del administrador usando AuthStateService (sincrónico para template inicial o usar el observable)
  // Como esto solo se renderiza una vez, el valor inicial es suficiente para el layout, pero para estar perfectos
  // podríamos suscribirnos, aunque para simplificar dejamos el localStorage initial state que ya está en el servicio.
  readonly correoAdmin = localStorage.getItem('bookifyUserEmail') ?? 'Administrador';

  cerrarSesion(): void {
    this.authState.logout();
    this.router.navigate(['/login']);
  }
}
