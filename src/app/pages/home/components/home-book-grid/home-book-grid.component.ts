import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { LibroService } from '../../../../services/libro';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home-book-grid',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home-book-grid.component.html',
  styleUrl: './home-book-grid.component.scss'
})
export class HomeBookGridComponent implements OnInit {
  private libroService = inject(LibroService);
  private cdr = inject(ChangeDetectorRef);

  books: any[] = [];
  cargando = true;

  ngOnInit(): void {
    // Pedir los primeros 6 libros para el grid de "Colecciones recomendadas"
    this.libroService.getLibrosPaginados(0, 6).subscribe({
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
        console.error('Error al cargar libros para el grid:', err);
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
