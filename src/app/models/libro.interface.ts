export interface Autor {
  id?: number;
  nombre: string;
}

export interface Categoria {
  id?: number;
  nombre: string;
}

export interface Libro {
  id?: number;
  titulo: string;
  descripcion?: string;
  precio: number;
  formato: string;
  portadaUrl?: string;
  activo?: boolean;
  autor: Autor;
  categoria: Categoria;
}