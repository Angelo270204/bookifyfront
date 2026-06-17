import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Libro } from '../models/libro.interface';
import { HistorialCompraDto } from '../models/historial-compra.interface';

export interface CompraResponse {
  preferenceId: string;
}

@Injectable({
  providedIn: 'root'
})
export class CompraService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/api/compras`;

  // Llama al backend para iniciar una compra y obtener el preferenceId (ahora se usará para el simulador)
  iniciarCompra(libroId: number): Observable<CompraResponse> {
    return this.http.post<CompraResponse>(`${this.apiUrl}/iniciar`, { libroId });
  }

  // Simular el pago enviando el preferenceId al backend
  simularPago(preferenceId: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/simular-pago`, { preferenceId }, { responseType: 'text' as 'json' });
  }

  // Obtener la biblioteca del usuario
  getMisLibros(): Observable<Libro[]> {
    return this.http.get<Libro[]>(`${this.apiUrl}/mis-libros`);
  }

  // Verificar acceso a un libro
  verificarAcceso(libroId: number): Observable<{ acceso: boolean; mensaje?: string }> {
    return this.http.get<{ acceso: boolean; mensaje?: string }>(`${this.apiUrl}/verificar-acceso/${libroId}`);
  }

  // Obtener el historial de compras con filtro opcional de fechas
  getHistorial(fechaInicio?: string, fechaFin?: string): Observable<HistorialCompraDto[]> {
    let params = new HttpParams();
    if (fechaInicio) params = params.set('fechaInicio', fechaInicio);
    if (fechaFin) params = params.set('fechaFin', fechaFin);
    
    return this.http.get<HistorialCompraDto[]>(`${this.apiUrl}/historial`, { params });
  }
}
