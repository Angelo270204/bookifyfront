import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { LibroService } from '../../../../services/libro';

// Paleta de degradados para las portadas virtuales
const PALETA_PORTADAS = [
  'linear-gradient(135deg, #1a3a5c 0%, #2d6a9f 100%)',
  'linear-gradient(135deg, #2c3e50 0%, #3498db 100%)',
  'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)',
  'linear-gradient(135deg, #0f2027 0%, #2c5364 100%)',
  'linear-gradient(135deg, #16213e 0%, #0f3460 100%)',
];

@Component({
  selector: 'app-home-side-panel',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './home-side-panel.component.html',
  styleUrl: './home-side-panel.component.scss'
})
export class HomeSidePanelComponent implements OnInit {
  private libroService = inject(LibroService);
  private cdr = inject(ChangeDetectorRef);

  nuevosLanzamientos: any[] = [];
  cargando = true;

  ngOnInit(): void {
    // 1. Intentar cargar las tendencias de la semana
    this.libroService.getTopLibros('semana').subscribe({
      next: (response) => {
        if (response && Array.isArray(response) && response.length > 0) {
          // Tomar los top 4 de la semana
          this.nuevosLanzamientos = response.slice(0, 4);
          this.cargando = false;
          this.cdr.detectChanges();
        } else {
          // Fallback: si no hay ventas en la BD, cargar nuevos lanzamientos genéricos
          this.cargarFallback();
        }
      },
      error: (err) => {
        console.error('Error al cargar top libros de la semana:', err);
        this.cargarFallback();
      }
    });
  }

  private cargarFallback(): void {
    this.libroService.getNuevosLanzamientos(4).subscribe({
      next: (response) => {
        if (response && response.content) {
          this.nuevosLanzamientos = response.content;
        } else if (Array.isArray(response)) {
          this.nuevosLanzamientos = response;
        }
        this.cargando = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error en fallback de side panel:', err);
        this.cargando = false;
        this.cdr.detectChanges();
      }
    });
  }

  // Devuelve un degradado de la paleta según el índice del libro
  obtenerColorPortada(index: number): string {
    return PALETA_PORTADAS[index % PALETA_PORTADAS.length];
  }
}
