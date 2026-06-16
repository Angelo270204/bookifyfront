import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LibroService } from '../../../services/libro';

@Component({
  selector: 'app-autores-page',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './autores-page.component.html',
  styleUrl: './autores-page.component.scss'
})
export class AutoresPageComponent implements OnInit {
  private libroService = inject(LibroService);
  private cdr = inject(ChangeDetectorRef); // Inyectamos el detector de cambios

  autores: any[] = [];
  mostrarFormulario = false;
  nuevoAutor = { nombre: '' };

  ngOnInit(): void {
    this.cargarAutores();
  }

  cargarAutores(): void {
    this.libroService.getAutores().subscribe({
      next: (data) => {
        this.autores = data;
        // Obligamos a Angular a redibujar la tabla inmediatamente
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Error al cargar autores:', err)
    });
  }

  toggleFormulario(): void {
    this.mostrarFormulario = !this.mostrarFormulario;
  }

  guardar(): void {
    if (!this.nuevoAutor.nombre.trim()) return;

    this.libroService.createAutor(this.nuevoAutor).subscribe({
      next: (response) => {
        console.log('Autor guardado correctamente');
        // Limpiamos los datos sin bloquear el navegador con alert
        this.nuevoAutor.nombre = '';
        this.mostrarFormulario = false;
        
        // Agregamos directamente a la tabla local
        this.autores.push(response);
        
        // Obligamos a Angular a pintar la tabla con el nuevo dato
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error al guardar autor:', err);
      }
    });
  }
}
