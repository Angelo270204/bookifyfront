import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { LibroService } from '../../../../services/libro';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-home-book-grid',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './home-book-grid.component.html',
  styleUrl: './home-book-grid.component.scss'
})
export class HomeBookGridComponent implements OnInit {
  private libroService = inject(LibroService);
  private cdr = inject(ChangeDetectorRef);

  books: any[] = [];
  cargando = true;

  ngOnInit(): void {
    // 1. Intentar cargar los libros más populares históricamente
    this.libroService.getTopLibros('siempre').subscribe({
      next: (resp) => {
        if (resp && Array.isArray(resp) && resp.length > 0) {
          this.books = resp;
          this.cargando = false;
          this.cdr.detectChanges();
        } else {
          // Fallback: si no hay ventas en la BD, cargar la paginación normal
          this.cargarFallback();
        }
      },
      error: (err) => {
        console.error('Error al cargar top libros históricos:', err);
        this.cargarFallback();
      }
    });
  }

  private cargarFallback(): void {
    this.libroService.getLibrosPaginados(0, 8).subscribe({
      next: (resp) => {
        if (resp && resp.content) {
          this.books = resp.content;
        } else if (Array.isArray(resp)) {
          this.books = resp;
        }
        this.cargando = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error en fallback de grid de libros:', err);
        this.cargando = false;
        this.cdr.detectChanges();
      }
    });
  }

  // Placeholder para la portada en caso de que no tenga
  getCoverUrl(book: any): string {
    return book.portadaUrl || 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&w=500&q=80';
  }
}
