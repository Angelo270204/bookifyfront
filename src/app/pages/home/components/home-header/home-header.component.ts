import { Component, ElementRef, HostListener, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink, Router } from '@angular/router';

@Component({
  selector: 'app-home-header',
  standalone: true,
  imports: [RouterLink, CommonModule, FormsModule],
  templateUrl: './home-header.component.html',
  styleUrl: './home-header.component.scss'
})
export class HomeHeaderComponent {
  protected userEmail = localStorage.getItem('bookifyUserEmail');
  protected isLoggedIn = !!this.userEmail;
  protected isMenuOpen = false;
  protected textoBusqueda = '';
  private readonly elementRef = inject(ElementRef);
  private readonly router = inject(Router);

  // Getter para saber si estamos en la página Explorar
  get isExplorarPage(): boolean {
    return this.router.url.includes('/explorar');
  }

  toggleMenu(): void {
    this.isMenuOpen = !this.isMenuOpen;
  }

  closeMenu(): void {
    this.isMenuOpen = false;
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    const target = event.target as Node;
    if (this.isMenuOpen && !this.elementRef.nativeElement.contains(target)) {
      this.closeMenu();
    }
  }

  logout(): void {
    this.closeMenu();
    // Limpiar almacenamiento local
    localStorage.removeItem('bookifyUserEmail');
    localStorage.removeItem('bookifyUserRoles');
    localStorage.removeItem('bookifyUserId');
    
    // Actualizar estado visual
    this.userEmail = null;
    this.isLoggedIn = false;
  }

  // Navega a la página Explorar con el texto del buscador como parámetro
  buscarRapido(): void {
    const q = this.textoBusqueda.trim();
    this.router.navigate(['/explorar'], q ? { queryParams: { q } } : {});
  }

  // Permite buscar con la tecla Enter
  onBusquedaEnter(event: KeyboardEvent): void {
    if (event.key === 'Enter') this.buscarRapido();
  }
}
