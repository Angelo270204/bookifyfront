import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';

export interface RegisterRequest {
  nombre: string;
  correo: string;
  contrasena: string;
}

export interface RegisterResponse {
  exito: boolean;
  mensaje: string;
  usuarioId: number | null;
  correo: string | null;
}

export interface LoginRequest {
  correo: string;
  contrasena: string;
}

export interface LoginResponse {
  exito: boolean;
  mensaje: string;
  usuarioId: number | null;
  correo: string | null;
  roles?: string[];
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = environment.apiUrl;

  register(payload: RegisterRequest): Observable<RegisterResponse> {
    return this.http.post<RegisterResponse>(`${this.apiUrl}/auth/register`, payload);
  }

  login(payload: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/auth/login`, payload);
  }

  logout(): Observable<any> {
    return this.http.post(`${this.apiUrl}/auth/logout`, {});
  }
}
