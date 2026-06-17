import { Component, OnInit, inject, ChangeDetectorRef, ViewChild, ElementRef, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LibroService } from '../../services/libro';

// Paleta para los placeholders de portada en la tabla
const PALETA_PORTADAS = [
  'linear-gradient(135deg, #1a3a5c 0%, #2d6a9f 100%)',
  'linear-gradient(135deg, #2c3e50 0%, #3498db 100%)',
  'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)',
  'linear-gradient(135deg, #0f2027 0%, #2c5364 100%)',
  'linear-gradient(135deg, #16213e 0%, #0f3460 100%)',
  'linear-gradient(135deg, #1b2838 0%, #2a475e 100%)',
];

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
  
  // null = Todos, true = Activos, false = Ocultos
  filtroEstado: boolean | null = true; 

  @Output() editarLibro = new EventEmitter<any>();

  // ID del libro cuya portada se está actualizando (para el spinner por fila)
  libroSubiendo: number | null = null;
  // ID del libro seleccionado para cambiar portada
  private libroIdSeleccionado: number | null = null;

  private libroService = inject(LibroService);
  private cdr = inject(ChangeDetectorRef);

  @ViewChild('inputPortadaTabla') inputPortadaTabla!: ElementRef<HTMLInputElement>;

  ngOnInit(): void {
    this.cargarLibros();
  }

  cargarLibros(page: number = 0) {
    this.libroService.getLibrosPaginados(page, 10, this.filtroEstado).subscribe({
      next: (response) => {
        // Validación segura por si la respuesta no viene paginada como esperamos
        if (response && response.content) {
          this.libros = response.content.map((libro: any) => ({
            ...libro,
            // Mapeamos el campo 'estado' que ahora nos envía el backend hacia nuestra variable 'activo'
            activo: libro.estado 
          }));
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

  // Guarda el ID del libro y abre el selector de archivo del sistema operativo
  abrirCambioPortada(libroId: number): void {
    if (this.libroSubiendo !== null) return; // Evitar doble clic
    this.libroIdSeleccionado = libroId;
    this.inputPortadaTabla.nativeElement.value = '';
    this.inputPortadaTabla.nativeElement.click();
  }

  // Maneja la imagen elegida: la sube a Cloudinary y luego actualiza el libro
  onCambiarPortada(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0 || !this.libroIdSeleccionado) return;

    const archivo = input.files[0];
    const libroId = this.libroIdSeleccionado;

    // Activamos el spinner solo en la fila correcta
    this.libroSubiendo = libroId;
    this.cdr.detectChanges();

    // Paso 1: subir la imagen a Cloudinary
    this.libroService.uploadImagen(archivo).subscribe({
      next: (respuesta) => {
        // Paso 2: enviar la URL al backend con PATCH
        this.libroService.updatePortada(libroId, respuesta.url).subscribe({
          next: () => {
            // Actualizamos la portada directamente en el arreglo local (sin recargar todo)
            const libro = this.libros.find(l => l.id === libroId);
            if (libro) libro.portadaUrl = respuesta.url;

            this.libroSubiendo = null;
            this.libroIdSeleccionado = null;
            this.cdr.detectChanges();
            console.log(`Portada del libro ${libroId} actualizada correctamente`);
          },
          error: (err) => {
            console.error('Error al actualizar portada en el backend:', err);
            this.libroSubiendo = null;
            this.cdr.detectChanges();
          }
        });
      },
      error: (err) => {
        console.error('Error al subir imagen a Cloudinary:', err);
        this.libroSubiendo = null;
        this.cdr.detectChanges();
      }
    });
  }

  // Devuelve un degradado según el ID del libro (consistente por libro)
  obtenerColorPortada(libroId: number): string {
    return PALETA_PORTADAS[libroId % PALETA_PORTADAS.length];
  }

  // Emite el evento para editar el libro
  onEditar(libro: any): void {
    this.editarLibro.emit(libro);
  }

  // Cambia el estado Activo/Inactivo del libro
  toggleEstado(libro: any): void {
    const accion = libro.activo === false ? 'restaurar' : 'ocultar';
    if (confirm(`¿Estás seguro de que deseas ${accion} el libro "${libro.titulo}"?`)) {
      const nuevoEstado = libro.activo === false ? true : false;
      this.libroService.updateEstado(libro.id, nuevoEstado).subscribe({
        next: () => {
          libro.activo = nuevoEstado;
          // Si estamos viendo "Activos" y lo ocultamos, lo quitamos de la vista. Y viceversa.
          if (this.filtroEstado !== null && this.filtroEstado !== nuevoEstado) {
            this.cargarLibros(this.currentPage);
          } else {
            this.cdr.detectChanges();
          }
        },
        error: (err) => console.error('Error al actualizar estado:', err)
      });
    }
  }

  // Filtrado de Tabs
  setFiltro(estado: boolean | null) {
    this.filtroEstado = estado;
    this.cargarLibros(0);
  }
}