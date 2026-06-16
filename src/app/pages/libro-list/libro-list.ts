import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LibroService } from '../../services/libro'; 

@Component({
  selector: 'app-libro-list',
  imports: [CommonModule],
  templateUrl: './libro-list.html',
  styleUrl: './libro-list.scss',
})
export class LibroList implements OnInit {
  libros: any[] = [];
  currentPage = 0;
  totalPages = 0;
  totalElements = 0;

  private libroService = inject(LibroService);
  private cdr = inject(ChangeDetectorRef); // Inyectamos ChangeDetectorRef

  ngOnInit(): void {
    this.cargarLibros();
  }

  cargarLibros(page: number = 0) {
    this.libroService.getLibrosPaginados(page, 10).subscribe({
      next: (response) => {
        // Validación segura por si la respuesta no viene paginada como esperamos
        if (response && response.content) {
          this.libros = response.content;
          this.currentPage = response.pageable?.pageNumber || 0;
          this.totalPages = response.totalPages || 0;
          this.totalElements = response.totalElements || 0;
        } else if (Array.isArray(response)) {
          // Fallback por si devuelve un arreglo directo
          this.libros = response;
        } else {
          this.libros = [];
        }
        
        console.log('Libros cargados:', this.libros);
        
        // Forzamos el redibujado de la tabla
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Error al conectar con Spring Boot:', err)
    });
  }

  cambiarPagina(nuevaPagina: number) {
    if (nuevaPagina >= 0 && nuevaPagina < this.totalPages) {
      this.cargarLibros(nuevaPagina);
    }
  }
}