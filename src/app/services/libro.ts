import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, shareReplay } from 'rxjs';
import { environment } from '../../environments/environment';

import { Libro } from '../models/libro.interface'; 

@Injectable({
  providedIn: 'root'
})
export class LibroService {
  private http = inject(HttpClient);  
  private apiUrl = `${environment.apiUrl}/libros`; 
  private autoresUrl = `${environment.apiUrl}/autores`;
  private categoriasUrl = `${environment.apiUrl}/categorias`;

  getLibrosPaginados(page: number = 0, size: number = 10): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/buscar?page=${page}&size=${size}`);
  }

  // Búsqueda avanzada con filtros dinámicos (para la página Explorar)
  buscarLibros(filtros: {
    titulo?: string;
    autorNombre?: string;
    categoriaNombre?: string;
    precioMin?: number;
    precioMax?: number;
    formato?: string;
    sort?: string;
    page?: number;
    size?: number;
  }): Observable<any> {
    const params = new URLSearchParams();
    if (filtros.titulo) params.set('titulo', filtros.titulo);
    if (filtros.autorNombre) params.set('autorNombre', filtros.autorNombre);
    if (filtros.categoriaNombre) params.set('categoriaNombre', filtros.categoriaNombre);
    if (filtros.precioMin !== undefined) params.set('precioMin', String(filtros.precioMin));
    if (filtros.precioMax !== undefined) params.set('precioMax', String(filtros.precioMax));
    if (filtros.formato) params.set('formato', filtros.formato);
    if (filtros.sort) params.set('sort', filtros.sort);
    params.set('page', String(filtros.page ?? 0));
    params.set('size', String(filtros.size ?? 12));
    return this.http.get<any>(`${this.apiUrl}/buscar?${params.toString()}`);
  }

  // Obtiene los últimos libros agregados, ordenados por fecha de registro descendente
  getNuevosLanzamientos(size: number = 10): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/buscar?sort=fechaRegistro,desc&size=${size}`);
  }

  // Obtiene los libros más vendidos / populares según historial de compras
  getTopLibros(periodo: 'hoy' | 'semana' | 'siempre' = 'siempre'): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/top?periodo=${periodo}`);
  }

  getLibroById(id: number): Observable<Libro> {
    return this.http.get<Libro>(`${this.apiUrl}/${id}`);
  }

  getLibrosSimilares(id: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/${id}/similares`);
  }

  createLibro(libro: Libro): Observable<Libro> {
    return this.http.post<Libro>(this.apiUrl, libro);
  }

  updateLibro(id: number, libro: Libro): Observable<Libro> {
    return this.http.put<Libro>(`${this.apiUrl}/${id}`, libro);
  }

  deleteLibro(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
  getAutores(): Observable<any[]> {
    return this.http.get<any[]>(this.autoresUrl);
  }

  getCategorias(): Observable<any[]> {
    return this.http.get<any[]>(this.categoriasUrl);
  }

  createAutor(autor: { nombre: string }): Observable<any> {
    return this.http.post<any>(this.autoresUrl, autor);
  }

  createCategoria(categoria: { nombre: string }): Observable<any> {
    return this.http.post<any>(this.categoriasUrl, categoria);
  }

  // Sube una imagen a Cloudinary a través del backend y retorna su URL pública
  uploadImagen(archivo: File): Observable<{ url: string }> {
    const formData = new FormData();
    formData.append('archivo', archivo);
    return this.http.post<{ url: string }>(`${environment.apiUrl}/upload/imagen`, formData);
  }

  // Actualiza solo la portada de un libro existente (llama al endpoint PATCH)
  updatePortada(id: number, portadaUrl: string): Observable<any> {
    return this.http.patch<any>(`${this.apiUrl}/${id}/portada`, { portadaUrl });
  }

  // Elimina una imagen huérfana o cancelada de Cloudinary
  deleteImagen(url: string): Observable<any> {
    return this.http.delete<any>(`${environment.apiUrl}/upload/imagen`, { body: { url } });
  }
}