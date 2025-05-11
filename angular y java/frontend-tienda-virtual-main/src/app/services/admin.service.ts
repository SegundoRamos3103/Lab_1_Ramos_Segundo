import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AdminService {
  private apiUrl = 'https://backend-tienda-virtual-production.up.railway.app/api/admin';

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
  }

  // Obtener estadísticas del dashboard
  obtenerEstadisticas(): Observable<any> {
    return this.http.get(`${this.apiUrl}/estadisticas`, { headers: this.getHeaders() });
  }

  // Listar todos los usuarios
  listarUsuarios(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/usuarios`, { headers: this.getHeaders() });
  }

  // Bloquear o desbloquear un usuario
  bloquearUsuario(usuarioId: string, bloquear: boolean): Observable<any> {
    return this.http.put(`${this.apiUrl}/usuarios/bloquear/${usuarioId}`, { bloquear }, { headers: this.getHeaders() });
  }

  // Eliminar un usuario
  eliminarUsuario(usuarioId: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/usuarios/eliminar/${usuarioId}`, { headers: this.getHeaders() });
  }

  // Crear una categoría
  crearCategoria(nombre: string, descripcion: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/categorias/crear`, { nombre, descripcion }, { headers: this.getHeaders() });
  }

  // Actualizar una categoría
  actualizarCategoria(categoriaId: string, nombre: string, descripcion: string): Observable<any> {
    return this.http.put(`${this.apiUrl}/categorias/actualizar/${categoriaId}`, { nombre, descripcion }, { headers: this.getHeaders() });
  }

  // Eliminar una categoría
  eliminarCategoria(categoriaId: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/categorias/eliminar/${categoriaId}`, { headers: this.getHeaders() });
  }

  // Listar todas las categorías (público)
  listarCategorias(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/categorias`);
  }
}
