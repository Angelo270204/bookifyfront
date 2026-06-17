import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LibroService } from '../../../../services/libro';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-home-hero',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './home-hero.component.html',
  styleUrl: './home-hero.component.scss'
})
export class HomeHeroComponent implements OnInit {
  private libroService = inject(LibroService);
  private cdr = inject(ChangeDetectorRef);

  featuredBook: any = null;
  cargando = true;

  ngOnInit(): void {
    // 1. Intentar cargar el libro más vendido de HOY
    this.libroService.getTopLibros('hoy').subscribe({
      next: (resp) => {
        if (resp && Array.isArray(resp) && resp.length > 0) {
          this.featuredBook = resp[0];
          this.cargando = false;
          this.cdr.detectChanges();
        } else {
          // Fallback: si no hay ventas hoy, cargar el último libro agregado
          this.cargarFallback();
        }
      },
      error: (err) => {
        console.error('Error al cargar top libros de hoy:', err);
        this.cargarFallback();
      }
    });
  }

  private cargarFallback(): void {
    this.libroService.getNuevosLanzamientos(1).subscribe({
      next: (resp) => {
        if (resp && resp.content && resp.content.length > 0) {
          this.featuredBook = resp.content[0];
        } else if (Array.isArray(resp) && resp.length > 0) {
          this.featuredBook = resp[0];
        }
        this.cargando = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error en fallback de libro destacado:', err);
        this.cargando = false;
        this.cdr.detectChanges();
      }
    });
  }

  getCoverUrl(): string {
    return this.featuredBook?.portadaUrl || 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?auto=format&fit=crop&w=700&q=80';
  }
}
