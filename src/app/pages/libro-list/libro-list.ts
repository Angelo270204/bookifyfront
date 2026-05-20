import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
// Ojo: Asegúrate de que esta ruta apunte bien al archivo libro.ts (o libro.service.ts) que modificaste antes
import { LibroService } from '../../services/libro'; 
import { Libro } from '../../models/libro.interface';

@Component({
  selector: 'app-libro-list',
  imports: [CommonModule],
  templateUrl: './libro-list.html',
  styleUrl: './libro-list.scss',
})
export class LibroList implements OnInit {
  libros: Libro[] = [];
  private libroService = inject(LibroService);

  ngOnInit(): void {
    this.cargarLibros();
  }

  cargarLibros() {
    this.libroService.getLibros().subscribe({
      next: (data) => {
        this.libros = data;
        console.log('Libros cargados:', data);
      },
      error: (err) => console.error('Error al conectar con Spring Boot:', err)
    });
  }
}