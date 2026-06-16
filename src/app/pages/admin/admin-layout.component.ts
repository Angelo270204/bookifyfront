import { Component, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './admin-layout.component.html',
  styleUrl: './admin-layout.component.scss'
})
export class AdminLayoutComponent {
  private readonly router = inject(Router);

  // Leer el correo del administrador guardado en el login
  readonly correoAdmin = localStorage.getItem('bookifyUserEmail') ?? 'Administrador';

  cerrarSesion(): void {
    localStorage.removeItem('bookifyUserRoles');
    localStorage.removeItem('bookifyUserEmail');
    localStorage.removeItem('bookifyUserId');
    this.router.navigate(['/login']);
  }
}
