import { Component, ElementRef, HostListener, inject, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink, Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { AuthStateService } from '../../../../services/auth-state.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-home-header',
  standalone: true,
  imports: [RouterLink, CommonModule, FormsModule],
  templateUrl: './home-header.component.html',
  styleUrl: './home-header.component.scss'
})
export class HomeHeaderComponent implements OnInit, OnDestroy {
  protected userEmail: string | null = null;
  protected isLoggedIn = false;
  protected isMenuOpen = false;
  protected textoBusqueda = '';

  private readonly elementRef = inject(ElementRef);
  private readonly router = inject(Router);
  private readonly authState = inject(AuthStateService);
  private subs: Subscription[] = [];

  ngOnInit(): void {
    this.subs.push(
      this.authState.isLoggedIn$.subscribe(isLoggedIn => this.isLoggedIn = isLoggedIn),
      this.authState.email$.subscribe(email => this.userEmail = email),
      // Limpiamos el buscador al cambiar de página
      this.router.events.pipe(
        filter(event => event instanceof NavigationEnd)
      ).subscribe(() => {
        this.textoBusqueda = '';
      })
    );
  }

  ngOnDestroy(): void {
    this.subs.forEach(s => s.unsubscribe());
  }

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
    this.authState.logout();
    this.router.navigate(['/login']);
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
