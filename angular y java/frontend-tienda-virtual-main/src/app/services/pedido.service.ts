import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PedidoService {
  private apiUrl = 'https://backend-tienda-virtual-production.up.railway.app/api/pedidos';

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
  }

  // Crear un pedido a partir del carrito
  crearPedido(): Observable<any> {
    return this.http.post(`${this.apiUrl}/crear`, {}, { headers: this.getHeaders() });
  }

  // Obtener el historial de pedidos del usuario
  obtenerHistorial(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/historial`, { headers: this.getHeaders() });
  }

  // Cancelar un pedido
  cancelarPedido(pedidoId: string): Observable<any> {
    return this.http.put(`${this.apiUrl}/cancelar/${pedidoId}`, {}, { headers: this.getHeaders() });
  }

  // Obtener todos los pedidos (para administradores)
  obtenerTodosPedidos(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/todos`, { headers: this.getHeaders() });
  }

  // Actualizar el estado de un pedido (para administradores)
  actualizarEstado(pedidoId: string, estado: string, transportista: string, numeroSeguimiento: string): Observable<any> {
    return this.http.put(
      `${this.apiUrl}/actualizar/${pedidoId}`,
      { estado, transportista, numeroSeguimiento },
      { headers: this.getHeaders() }
    );
  }
}
