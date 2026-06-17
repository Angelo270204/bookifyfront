import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface CompraResponse {
  preferenceId: string;
}

@Injectable({
  providedIn: 'root'
})
export class CompraService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/api/compras`;

  // Llama al backend para iniciar una compra y obtener el preferenceId de Mercado Pago
  iniciarCompra(libroId: number): Observable<CompraResponse> {
    return this.http.post<CompraResponse>(`${this.apiUrl}/iniciar`, { libroId });
  }
}
