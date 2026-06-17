import { Component, ViewChild, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LibroForm } from '../libro-form/libro-form';
import { LibroList } from '../libro-list/libro-list';
import { LibroService } from '../../services/libro';

@Component({
  selector: 'app-libro-page',
  standalone: true,
  imports: [CommonModule, LibroForm, LibroList],
  templateUrl: './libro-page.html',
  styleUrl: './libro-page.scss'
})
export class LibroPage {
  private libroService = inject(LibroService);
  private cdr = inject(ChangeDetectorRef);
  @ViewChild(LibroList) componenteTabla!: LibroList;

  mostrarFormulario = false;
  libroSeleccionado: any = null;

  toggleFormulario(): void {
    if (this.mostrarFormulario) {
      // Si se está cerrando, limpiamos el libro seleccionado
      this.libroSeleccionado = null;
    }
    this.mostrarFormulario = !this.mostrarFormulario;
  }

  editarLibro(libroListData: any): void {
    // Obtenemos el libro completo por ID ya que la tabla (Dto) no trae los IDs de autor/categoría
    this.libroService.getLibroById(libroListData.id).subscribe({
      next: (libroCompleto: any) => {
        this.libroSeleccionado = libroCompleto;
        this.mostrarFormulario = true;
        this.cdr.detectChanges(); // Forzamos el redibujado para evitar el doble clic
      },
      error: (err: any) => console.error('Error al obtener detalles del libro:', err)
    });
  }

  onLibroGuardado(): void {
    this.mostrarFormulario = false;
    this.libroSeleccionado = null;
    if (this.componenteTabla) {
      this.componenteTabla.cargarLibros();
    }
  }
}