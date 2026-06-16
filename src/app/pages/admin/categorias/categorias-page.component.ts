import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LibroService } from '../../../services/libro';

@Component({
  selector: 'app-categorias-page',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './categorias-page.component.html',
  styleUrl: './categorias-page.component.scss'
})
export class CategoriasPageComponent implements OnInit {
  private libroService = inject(LibroService);
  private cdr = inject(ChangeDetectorRef); // Inyectamos el detector de cambios

  categorias: any[] = [];
  mostrarFormulario = false;
  nuevaCategoria = { nombre: '' };

  ngOnInit(): void {
    this.cargarCategorias();
  }

  cargarCategorias(): void {
    this.libroService.getCategorias().subscribe({
      next: (data) => {
        this.categorias = data;
        // Obligamos a Angular a redibujar la tabla inmediatamente
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Error al cargar categorías:', err)
    });
  }

  toggleFormulario(): void {
    this.mostrarFormulario = !this.mostrarFormulario;
  }

  guardar(): void {
    if (!this.nuevaCategoria.nombre.trim()) return;

    this.libroService.createCategoria(this.nuevaCategoria).subscribe({
      next: (response) => {
        console.log('Categoría guardada correctamente');
        // Limpiamos sin bloquear
        this.nuevaCategoria.nombre = '';
        this.mostrarFormulario = false;
        
        // Agregamos directamente a la tabla local
        this.categorias.push(response);
        
        // Obligamos a Angular a pintar la tabla con el nuevo dato
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error al guardar categoría:', err);
      }
    });
  }
}
