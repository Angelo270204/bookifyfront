import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { LibroService } from '../../services/libro';
import { CompraService } from '../../services/compra.service';
import { AuthStateService } from '../../services/auth-state.service';
import { Libro } from '../../models/libro.interface';

@Component({
  selector: 'app-detalle-libro-page',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './detalle-libro-page.component.html',
  styleUrl: './detalle-libro-page.component.scss'
})
export class DetalleLibroPageComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private libroService = inject(LibroService);
  private compraService = inject(CompraService);
  private authState = inject(AuthStateService);
  private cdr = inject(ChangeDetectorRef);

  libro: Libro | null = null;
  cargando = true;
  error: string | null = null;
  mensajeErrorCompra: string | null = null;
  
  // Para la validación de propiedad
  yaComprado = false;
  verificandoAcceso = false;

  librosSimilares: any[] = [];
  cargandoSimilares = true;
  
  procesandoCompra = false;

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const idParam = params.get('id');
      if (idParam) {
        const id = Number(idParam);
        
        // Resetear estado al navegar a un nuevo libro
        this.cargando = true;
        this.cargandoSimilares = true;
        this.libro = null;
        this.librosSimilares = [];
        this.error = null;
        
        // Desplazar la vista al tope
        window.scrollTo({ top: 0, behavior: 'smooth' });

        this.cargarLibro(id);
        this.cargarSimilares(id);
      } else {
        this.error = 'No se proporcionó un ID válido.';
        this.cargando = false;
        this.cargandoSimilares = false;
      }
    });
  }

  cargarLibro(id: number): void {
    this.libroService.getLibroById(id).subscribe({
      next: (data) => {
        this.libro = data;
        this.cargando = false;
        this.cdr.detectChanges();
        this.verificarSiYaLoCompro(id);
      },
      error: (err) => {
        console.error('Error al cargar libro:', err);
        this.error = err.error?.mensaje || 'Error al cargar los detalles del libro. Es posible que no exista.';
        this.cargando = false;
        this.cdr.detectChanges();
      }
    });
  }

  cargarSimilares(id: number): void {
    this.libroService.getLibrosSimilares(id).subscribe({
      next: (data) => {
        this.librosSimilares = data || [];
        this.cargandoSimilares = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error al cargar libros similares:', err);
        this.cargandoSimilares = false;
        this.cdr.detectChanges();
      }
    });
  }

  verificarSiYaLoCompro(libroId: number): void {
    // Solo verificar si hay alguien logeado
    if (!localStorage.getItem('bookifyUserEmail')) return;

    this.verificandoAcceso = true;
    this.compraService.verificarAcceso(libroId).subscribe({
      next: (res) => {
        if (res.acceso) {
          this.yaComprado = true;
        }
        this.verificandoAcceso = false;
        this.cdr.detectChanges();
      },
      error: () => {
        // 403 Forbidden significa que no lo ha comprado, lo cual es normal.
        this.yaComprado = false;
        this.verificandoAcceso = false;
        this.cdr.detectChanges();
      }
    });
  }

  comprarLibro(): void {
    if (!this.libro || !this.libro.id || this.libro.activo === false) return;
    this.procesandoCompra = true;

    this.mensajeErrorCompra = null;
    this.compraService.iniciarCompra(this.libro.id).subscribe({
      next: (res) => {
        if (res.preferenceId) {
          // Redirigir a la vista de pago simulada
          this.router.navigate(['/pago', res.preferenceId]);
        }
      },
      error: (err) => {
        console.error('Error al iniciar compra:', err);
        this.procesandoCompra = false;
        this.cdr.detectChanges();
        
        if (err.status === 401 || err.status === 403) {
          this.router.navigate(['/login'], { queryParams: { returnUrl: this.router.url } });
        } else if (err.status === 500) {
          // El backend rechaza la recompra lanzando IllegalStateException
          this.mensajeErrorCompra = 'Ya tienes este libro en tu biblioteca.';
          this.yaComprado = true; // Por si acaso actualizar la vista
          
          setTimeout(() => {
            this.mensajeErrorCompra = null;
            this.cdr.detectChanges();
          }, 4000);
        }
      }
    });
  }

  // Paleta de degradados para las portadas virtuales sin imagen
  colorPortada(index: number): string {
    const PALETA = [
      'linear-gradient(135deg, #1a3a5c 0%, #2d6a9f 100%)',
      'linear-gradient(135deg, #2c3e50 0%, #3498db 100%)',
      'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)',
      'linear-gradient(135deg, #0f2027 0%, #2c5364 100%)',
      'linear-gradient(135deg, #16213e 0%, #0f3460 100%)'
    ];
    return PALETA[index % PALETA.length];
  }
}
