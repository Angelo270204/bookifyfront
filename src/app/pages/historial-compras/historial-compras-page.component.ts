import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { CompraService } from '../../services/compra.service';
import { HistorialCompraDto } from '../../models/historial-compra.interface';

@Component({
  selector: 'app-historial-compras-page',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './historial-compras-page.component.html',
  styleUrl: './historial-compras-page.component.scss'
})
export class HistorialComprasPageComponent implements OnInit {
  private compraService = inject(CompraService);
  private cdr = inject(ChangeDetectorRef);

  compras: HistorialCompraDto[] = [];
  cargando = true;
  error: string | null = null;
  mensajeFiltroError: string | null = null;

  fechaInicioStr = '';
  fechaFinStr = '';

  ngOnInit(): void {
    this.cargarHistorial();
  }

  cargarHistorial(): void {
    this.cargando = true;
    this.error = null;

    let fechaInicioIso: string | undefined;
    let fechaFinIso: string | undefined;

    if (this.fechaInicioStr) {
      fechaInicioIso = `${this.fechaInicioStr}T00:00:00`;
    }
    if (this.fechaFinStr) {
      fechaFinIso = `${this.fechaFinStr}T23:59:59`;
    }

    this.compraService.getHistorial(fechaInicioIso, fechaFinIso).subscribe({
      next: (data) => {
        this.compras = data;
        this.cargando = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error al cargar historial', err);
        this.error = 'Ocurrió un error al cargar tu historial de compras.';
        this.cargando = false;
        this.cdr.detectChanges();
      }
    });
  }

  buscar(): void {
    this.mensajeFiltroError = null;
    
    // Validación de fechas lógicas
    if (this.fechaInicioStr && this.fechaFinStr) {
      const inicio = new Date(this.fechaInicioStr);
      const fin = new Date(this.fechaFinStr);
      
      if (inicio > fin) {
        this.mensajeFiltroError = 'La fecha de inicio no puede ser posterior a la fecha de fin.';
        return; // Detenemos la búsqueda
      }
    }

    this.cargarHistorial();
  }

  limpiarFiltros(): void {
    this.fechaInicioStr = '';
    this.fechaFinStr = '';
    this.mensajeFiltroError = null;
    this.cargarHistorial();
  }

  obtenerColorEstado(estado: string): string {
    switch (estado.toUpperCase()) {
      case 'COMPLETADA': return 'badge-success';
      case 'PENDIENTE': return 'badge-warning';
      case 'RECHAZADA': return 'badge-danger';
      default: return 'badge-secondary';
    }
  }

  colorPortada(index: number): string {
    const PALETA = [
      'linear-gradient(135deg, #1a3a5c 0%, #2d6a9f 100%)',
      'linear-gradient(135deg, #2c3e50 0%, #3498db 100%)',
      'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)',
      'linear-gradient(135deg, #0f2027 0%, #2c5364 100%)'
    ];
    return PALETA[index % PALETA.length];
  }
}
