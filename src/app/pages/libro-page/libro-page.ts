import { Component, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LibroForm } from '../libro-form/libro-form';
import { LibroList } from '../libro-list/libro-list';

@Component({
  selector: 'app-libro-page',
  standalone: true,
  imports: [CommonModule, LibroForm, LibroList],
  templateUrl: './libro-page.html',
  styleUrl: './libro-page.scss'
})
export class LibroPage {
  @ViewChild(LibroList) componenteTabla!: LibroList;

  mostrarFormulario = false;

  toggleFormulario(): void {
    this.mostrarFormulario = !this.mostrarFormulario;
  }

  onLibroGuardado(): void {
    this.mostrarFormulario = false;
    if (this.componenteTabla) {
      this.componenteTabla.cargarLibros();
    }
  }
}