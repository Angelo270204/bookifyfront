import {
  Component, OnInit, OnDestroy, inject, ChangeDetectorRef
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Subject, forkJoin, debounceTime, distinctUntilChanged, takeUntil } from 'rxjs';
import { LibroService } from '../../services/libro';

// Paleta de colores para los placeholders de portada
const PALETA = [
  'linear-gradient(135deg, #1a3a5c 0%, #2d6a9f 100%)',
  'linear-gradient(135deg, #2c3e50 0%, #3498db 100%)',
  'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)',
  'linear-gradient(135deg, #0f2027 0%, #2c5364 100%)',
  'linear-gradient(135deg, #16213e 0%, #0f3460 100%)',
  'linear-gradient(135deg, #1b2838 0%, #2a475e 100%)',
];

@Component({
  selector: 'app-explorar-page',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './explorar-page.component.html',
  styleUrl: './explorar-page.component.scss',
})
export class ExplorarPageComponent implements OnInit, OnDestroy {
  private libroService = inject(LibroService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private cdr = inject(ChangeDetectorRef);
  private destroy$ = new Subject<void>();
  private busquedaSubject = new Subject<string>();

  // Datos
  libros: any[] = [];
  categorias: any[] = [];
  autores: any[] = [];

  // Estado de UI
  cargando = true;
  cargandoEsqueletos = Array(12).fill(0); // Array para el skeleton loader

  // Paginación
  paginaActual = 0;
  totalPaginas = 0;
  totalElementos = 0;

  // Filtros activos
  busqueda = '';
  categoriaSeleccionada = '';
  autorSeleccionado = '';
  formatoSeleccionado = '';
  ordenSeleccionado = 'titulo,asc';

  // Chips de formato rápido
  formatos = [
    { valor: '', etiqueta: 'Todos' },
    { valor: 'PDF', etiqueta: 'PDF' },
    { valor: 'EPUB', etiqueta: 'EPUB' },
    { valor: 'MOBI', etiqueta: 'MOBI' },
    { valor: 'AZW3', etiqueta: 'AZW3' },
  ];

  // Opciones de ordenamiento
  opcionesOrden = [
    { valor: 'titulo,asc', etiqueta: 'A - Z' },
    { valor: 'titulo,desc', etiqueta: 'Z - A' },
    { valor: 'precio,asc', etiqueta: 'Precio: menor a mayor' },
    { valor: 'precio,desc', etiqueta: 'Precio: mayor a menor' },
    { valor: 'fechaRegistro,desc', etiqueta: 'Más recientes' },
  ];

  ngOnInit(): void {
    // Sincronizamos la carga de filtros auxiliares ANTES de disparar la primera búsqueda
    forkJoin({
      categorias: this.libroService.getCategorias(),
      autores: this.libroService.getAutores()
    }).pipe(takeUntil(this.destroy$)).subscribe({
      next: (data) => {
        this.categorias = data.categorias;
        this.autores = data.autores;
        this.cdr.detectChanges();

        // Una vez listos los filtros, escuchamos la URL y buscamos
        this.iniciarSuscripcionRuta();
      },
      error: (e) => {
        console.error('Error al cargar datos auxiliares:', e);
        // Como fallback, iniciamos igual la ruta aunque no haya categorías/autores
        this.iniciarSuscripcionRuta();
      }
    });

    // Debounce para la búsqueda rápida por texto (evitar petición en cada tecla)
    this.busquedaSubject.pipe(
      debounceTime(350),
      distinctUntilChanged(),
      takeUntil(this.destroy$)
    ).subscribe(() => this.buscar(0));
  }

  private iniciarSuscripcionRuta(): void {
    // Leer el parámetro `q` de la URL (ej: /explorar?q=Harry)
    this.route.queryParams.pipe(takeUntil(this.destroy$)).subscribe(params => {
      if (params['q']) {
        const term = params['q'].toLowerCase().trim();
        
        // --- BÚSQUEDA INTELIGENTE (SMART SEARCH) INICIAL ---
        // Si venimos del buscador rápido (header), mapeamos al filtro correcto
        const matchCategoria = this.categorias.find(c => c.nombre.toLowerCase().includes(term));
        const matchAutor = this.autores.find(a => a.nombre.toLowerCase().includes(term));

        if (matchCategoria) {
          this.categoriaSeleccionada = matchCategoria.nombre;
          this.busqueda = ''; // Limpiamos el texto
        } else if (matchAutor) {
          this.autorSeleccionado = matchAutor.nombre;
          this.busqueda = ''; // Limpiamos el texto
        } else {
          this.busqueda = params['q'];
        }
      }
      this.buscar(0);
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  // Disparar búsqueda con todos los filtros activos
  buscar(pagina: number = 0): void {
    this.cargando = true;
    this.paginaActual = pagina;
    this.cdr.detectChanges();

    let queryParams: any = {
      titulo: this.busqueda || undefined,
      categoriaNombre: this.categoriaSeleccionada || undefined,
      autorNombre: this.autorSeleccionado || undefined,
      formato: this.formatoSeleccionado || undefined,
      sort: this.ordenSeleccionado,
      page: pagina,
      size: 12,
    };

    this.libroService.buscarLibros(queryParams).subscribe({
      next: (resp) => {
        this.libros = resp.content ?? (Array.isArray(resp) ? resp : []);
        this.totalPaginas = resp.totalPages ?? 0;
        this.totalElementos = resp.totalElements ?? 0;
        this.cargando = false;
        this.cdr.detectChanges();
      },
      error: (e) => {
        console.error('Error al buscar libros:', e);
        this.cargando = false;
        this.cdr.detectChanges();
      }
    });
  }

  // Para el debounce del input de texto
  onTextoCambia(): void {
    // Si el usuario escribe algo en el buscador de título, limpiamos el resto de filtros
    if (this.busqueda.trim() !== '') {
      this.categoriaSeleccionada = '';
      this.autorSeleccionado = '';
      this.formatoSeleccionado = '';
    }
    this.busquedaSubject.next(this.busqueda);
  }

  // Aplicar filtro de categoría (un solo clic)
  filtrarPorCategoria(nombre: string): void {
    this.categoriaSeleccionada = this.categoriaSeleccionada === nombre ? '' : nombre;
    this.buscar(0);
  }

  // Aplicar filtro de formato
  filtrarPorFormato(valor: string): void {
    this.formatoSeleccionado = valor;
    this.buscar(0);
  }

  // Limpiar todos los filtros
  limpiarFiltros(): void {
    this.busqueda = '';
    this.categoriaSeleccionada = '';
    this.autorSeleccionado = '';
    this.formatoSeleccionado = '';
    this.ordenSeleccionado = 'titulo,asc';
    this.buscar(0);
  }

  // Color de placeholder (consistente por id del libro)
  colorPortada(id: number): string {
    return PALETA[id % PALETA.length];
  }

  // Verificar si hay algún filtro activo
  get hayFiltrosActivos(): boolean {
    return !!(this.busqueda || this.categoriaSeleccionada ||
      this.autorSeleccionado || this.formatoSeleccionado);
  }
}
