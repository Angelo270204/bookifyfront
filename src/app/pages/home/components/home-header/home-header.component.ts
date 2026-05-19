import { Component, ElementRef, HostListener, inject } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-home-header',
  imports: [RouterLink],
  templateUrl: './home-header.component.html',
  styleUrl: './home-header.component.scss'
})
export class HomeHeaderComponent {
  protected userEmail = localStorage.getItem('bookifyUserEmail') ?? 'lectora@bookify.com';
  protected isMenuOpen = false;
  private readonly elementRef = inject(ElementRef);

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
}
