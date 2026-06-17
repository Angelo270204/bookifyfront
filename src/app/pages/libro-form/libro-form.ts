import { Component, inject, Output, EventEmitter, OnInit, ViewChild, ElementRef, ChangeDetectorRef, Input } from '@angular/core';
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
export class LibroForm implements OnInit {
  private libroService = inject(LibroService);
  private cdr = inject(ChangeDetectorRef); // Necesario para forzar redibujado tras la subida async
  @Output() libroGuardado = new EventEmitter<void>();
  @Output() cancelar = new EventEmitter<void>();
  @ViewChild('inputPortada') inputPortada!: ElementRef<HTMLInputElement>;

  // Detectar cuándo se pasa un libro a editar
  @Input() set libroAEditar(libro: any) {
    if (libro) {
      this.esEdicion = true;
      this.previewPortadaUrl = libro.portadaUrl || null;
      this.nuevoLibro = {
        id: libro.id,
        titulo: libro.titulo,
        descripcion: libro.descripcion,
        precio: libro.precio,
        formato: libro.formato,
        portadaUrl: libro.portadaUrl,
        autorId: libro.autor?.id || libro.autorId,
        categoriaId: libro.categoria?.id || libro.categoriaId
      };
    } else {
      this.resetFormulario();
    }
  }

  esEdicion = false;

  // Arreglos vacíos para almacenar lo que devuelva el backend
  autores: any[] = [];
  categorias: any[] = [];

  // Estado de la portada
  subiendoPortada = false;
  previewPortadaUrl: string | null = null;
  errorPortada: string | null = null;

  nuevoLibro: any = {
    titulo: '',
    descripcion: '',
    precio: 0,
    formato: '',
    portadaUrl: '',
    autorId: null,
    categoriaId: null
  };

  // Se ejecuta cuando el formulario aparece en pantalla
  ngOnInit(): void {
    // Cargamos autores y categorías del backend
    this.libroService.getAutores().subscribe({
      next: (data) => this.autores = data,
      error: (err) => console.error('Error al traer autores:', err)
    });

    this.libroService.getCategorias().subscribe({
      next: (data) => this.categorias = data,
      error: (err) => console.error('Error al traer categorías:', err)
    });
  }

  // Abre el selector de archivos al hacer clic en la zona de portada
  abrirSelectorPortada(): void {
    this.inputPortada.nativeElement.click();
  }

  // Maneja la selección de imagen, la sube a Cloudinary y guarda la URL
  onPortadaSeleccionada(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) return;

    const archivo = input.files[0];

    // Validación de tamaño: máximo 2MB
    if (archivo.size > 2 * 1024 * 1024) {
      this.errorPortada = 'La imagen no puede pesar más de 2MB.';
      return;
    }

    // Si ya había una imagen subida, la eliminamos primero para no dejar basura
    if (this.nuevoLibro.portadaUrl) {
      this.libroService.deleteImagen(this.nuevoLibro.portadaUrl).subscribe({
        error: (e) => console.warn('No se pudo borrar imagen previa en Cloudinary:', e)
      });
    }

    this.errorPortada = null;
    this.subiendoPortada = true;

    // Creamos un preview local inmediato para buena experiencia de usuario
    const lector = new FileReader();
    lector.onload = (e) => {
      this.previewPortadaUrl = e.target?.result as string;
    };
    lector.readAsDataURL(archivo);

    // Subimos a Cloudinary a través del backend
    this.libroService.uploadImagen(archivo).subscribe({
      next: (respuesta) => {
        this.nuevoLibro.portadaUrl = respuesta.url;
        this.subiendoPortada = false;
        // Forzamos el redibujado porque multipart/form-data puede escapar la zona de Angular
        this.cdr.detectChanges();
        console.log('Portada subida a Cloudinary:', respuesta.url);
      },
      error: (err) => {
        console.error('Error al subir portada:', err);
        this.subiendoPortada = false;
        this.errorPortada = 'Error al subir la imagen. Inténtalo de nuevo.';
        this.previewPortadaUrl = null;
        // Forzamos el redibujado para mostrar el mensaje de error
        this.cdr.detectChanges();
      }
    });
  }

  guardar() {
    if (this.esEdicion) {
      // Flujo de Actualización
      this.libroService.updateLibro(this.nuevoLibro.id, this.nuevoLibro).subscribe({
        next: (response) => {
          this.libroGuardado.emit();
          this.resetFormulario();
          console.log('Libro editado con éxito:', response);
        },
        error: (err) => console.error('Error al editar libro:', err)
      });
    } else {
      // Flujo de Creación
      this.libroService.createLibro(this.nuevoLibro).subscribe({
        next: (response) => {
          this.libroGuardado.emit();
          this.resetFormulario();
          console.log('Libro guardado con éxito:', response);
        },
        error: (err) => {
          console.error('Error al guardar libro:', err);
          if (this.nuevoLibro.portadaUrl) {
            this.libroService.deleteImagen(this.nuevoLibro.portadaUrl).subscribe({
              next: () => console.log('Imagen huérfana eliminada'),
              error: (e) => console.warn('Error al borrar imagen huérfana:', e)
            });
          }
        }
      });
    }
  }

  // Se ejecuta al dar clic en el botón Cancelar
  onCancelar() {
    // Si hay una imagen recién subida y no estábamos editando (o si es una nueva imagen), la borramos
    // (Por simplicidad en la demo, si cancela durante edición, no eliminamos la foto, ya que podría ser la original).
    if (!this.esEdicion && this.nuevoLibro.portadaUrl) {
      this.libroService.deleteImagen(this.nuevoLibro.portadaUrl).subscribe({
        next: () => console.log('Imagen cancelada eliminada de Cloudinary'),
        error: (e) => console.warn('Error al intentar borrar imagen cancelada:', e)
      });
    }

    this.resetFormulario();
    this.cancelar.emit();
  }

  private resetFormulario() {
    this.esEdicion = false;
    this.nuevoLibro = {
      titulo: '', descripcion: '', precio: 0, formato: '',
      portadaUrl: '', autorId: null, categoriaId: null
    };
    this.previewPortadaUrl = null;
    this.errorPortada = null;
    if (this.inputPortada) this.inputPortada.nativeElement.value = '';
    this.cdr.detectChanges();
  }
}