import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { CompraService } from '../../services/compra.service';
import { Libro } from '../../models/libro.interface';

@Component({
  selector: 'app-biblioteca-page',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './biblioteca-page.component.html',
  styleUrls: ['./biblioteca-page.component.scss']
})
export class BibliotecaPageComponent implements OnInit {
  private compraService = inject(CompraService);
  private router = inject(Router);
  private cdr = inject(ChangeDetectorRef);

  misLibros: Libro[] = [];
  cargando = true;
  mensajeInfo: string | null = null;
  mensajeError: string | null = null;

  ngOnInit(): void {
    this.cargarMisLibros();
  }

  cargarMisLibros(): void {
    this.cargando = true;
    this.compraService.getMisLibros().subscribe({
      next: (libros) => {
        this.misLibros = libros;
        this.cargando = false;
        this.cdr.detectChanges(); // Forzar actualización de la UI
      },
      error: (err) => {
        console.error('Error al cargar mis libros:', err);
        this.cargando = false;
        this.cdr.detectChanges(); // Forzar actualización de la UI
        if (err.status === 401 || err.status === 403) {
          this.router.navigate(['/login']);
        }
      }
    });
  }

  accederLibro(libro: Libro): void {
    if (!libro.id) return;
    
    this.mensajeInfo = null;
    this.mensajeError = null;

    this.compraService.verificarAcceso(libro.id).subscribe({
      next: (res) => {
        if (res.acceso) {
          this.mensajeInfo = `📚 Visor en construcción: Tienes acceso confirmado a "${libro.titulo}". Próximamente podrás leerlo aquí.`;
          this.cdr.detectChanges(); // Forzar actualización

          // Ocultar mensaje después de unos segundos
          setTimeout(() => {
            this.mensajeInfo = null;
            this.cdr.detectChanges();
          }, 5000);
        }
      },
      error: (err) => {
        console.error('Error de acceso:', err);
        this.mensajeError = '🚫 ACCESO DENEGADO: No tienes permisos para visualizar este libro.';
        this.cdr.detectChanges(); // Forzar actualización
        
        // Redirigir al catálogo después de mostrar el error brevemente
        setTimeout(() => {
          this.router.navigate(['/explorar']);
        }, 3000);
      }
    });
  }

  colorPortada(index: number): string {
    const PALETA = [
      'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)',
      'linear-gradient(135deg, #4b1248 0%, #f0c27b 100%)',
      'linear-gradient(135deg, #1d976c 0%, #93f9b9 100%)',
      'linear-gradient(135deg, #eb3349 0%, #f45c43 100%)',
      'linear-gradient(135deg, #43cea2 0%, #185a9d 100%)'
    ];
    return PALETA[index % PALETA.length];
  }
}
