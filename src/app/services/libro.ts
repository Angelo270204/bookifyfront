import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, shareReplay } from 'rxjs';

import { Libro } from '../models/libro.interface'; 

@Injectable({
  providedIn: 'root'
})
export class LibroService {
  private http = inject(HttpClient);  
  private apiUrl = 'http://localhost:8080/libros'; 
  private autoresUrl = 'http://localhost:8080/autores';
  private categoriasUrl = 'http://localhost:8080/categorias';

  getLibrosPaginados(page: number = 0, size: number = 10): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/buscar?page=${page}&size=${size}`);
  }

  // Obtiene los últimos libros agregados, ordenados por fecha de registro descendente
  getNuevosLanzamientos(size: number = 10): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/buscar?sort=fechaRegistro,desc&size=${size}`);
  }

  getLibroById(id: number): Observable<Libro> {
    return this.http.get<Libro>(`${this.apiUrl}/${id}`);
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
    return this.http.post<{ url: string }>('http://localhost:8080/upload/imagen', formData);
  }

  // Actualiza solo la portada de un libro existente (llama al endpoint PATCH)
  updatePortada(id: number, portadaUrl: string): Observable<any> {
    return this.http.patch<any>(`${this.apiUrl}/${id}/portada`, { portadaUrl });
  }

  // Elimina una imagen huérfana o cancelada de Cloudinary
  deleteImagen(url: string): Observable<any> {
    return this.http.delete<any>('http://localhost:8080/upload/imagen', { body: { url } });
  }
}