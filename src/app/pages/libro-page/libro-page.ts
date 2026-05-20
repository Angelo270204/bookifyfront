import { Component, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LibroForm } from '../libro-form/libro-form'; // <-- CORREGIDO: Sin el .component
import { LibroList } from '../libro-list/libro-list'; // <-- CORREGIDO: Sin el .component

@Component({
  selector: 'app-libro-page',
  standalone: true,
  imports: [CommonModule, LibroForm, LibroList], 
  templateUrl: './libro-page.html'
})
export class LibroPage {
  // Usamos la clase exacta LibroList
  @ViewChild(LibroList) componenteTabla!: LibroList;

  actualizarTabla() {
    if (this.componenteTabla) {
      this.componenteTabla.cargarLibros();
    }
  }
}