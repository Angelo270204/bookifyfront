import { Component, inject, Output, EventEmitter, OnInit } from '@angular/core'; // <-- Agregamos OnInit
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LibroService } from '../../services/libro';

@Component({
  selector: 'app-libro-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './libro-form.html',
  styleUrl: './libro-form.scss',
})
export class LibroForm implements OnInit { // <-- Agregamos "implements OnInit"
  private libroService = inject(LibroService);
  @Output() libroGuardado = new EventEmitter<void>();

  // Arreglos vacíos para almacenar lo que devuelva el backend
  autores: any[] = [];
  categorias: any[] = [];

  nuevoLibro: any = {
    titulo: '',
    descripcion: '',
    precio: 0,
    formato: '',
    portadaUrl: '',
    autorId: null,
    categoriaId: null
  };

  // Esto se ejecuta automáticamente cuando el formulario aparece en pantalla
  ngOnInit(): void {
    // Llamamos al backend para llenar el arreglo de autores
    this.libroService.getAutores().subscribe({
      next: (data) => this.autores = data,
      error: (err) => console.error('Error al traer autores:', err)
    });

    // Llamamos al backend para llenar el arreglo de categorías
    this.libroService.getCategorias().subscribe({
      next: (data) => this.categorias = data,
      error: (err) => console.error('Error al traer categorías:', err)
    });
  }

guardar() {
    this.libroService.createLibro(this.nuevoLibro).subscribe({
      next: (response) => {
        // 1. Primero tocamos el timbre para que la tabla vuele a traer los datos
        this.libroGuardado.emit(); 
        
        // 2. Limpiamos las cajas de texto de inmediato
        this.nuevoLibro = {
          titulo: '', descripcion: '', precio: 0, formato: '',
          portadaUrl: '', autorId: null, categoriaId: null
        };

        // 3. Al final lanzamos el aviso en consola (sin bloquear)
        console.log('Libro guardado con éxito:', response);
      },
      error: (err) => {
        console.error('Error al guardar:', err);
      }
    });
  }
}