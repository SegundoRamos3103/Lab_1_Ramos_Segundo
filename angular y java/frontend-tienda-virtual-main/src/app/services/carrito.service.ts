import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CarritoService {
  private apiUrl = 'https://backend-tienda-virtual-production.up.railway.app/api/carrito';

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
  }

  // Actualizar la cantidad de un producto en el carrito
  actualizarCantidad(productoId: string, cantidad: number): Observable<any> {
    return this.http.put(
      `${this.apiUrl}/actualizar`,
      { productoId, cantidad },
      { headers: this.getHeaders() }
    );
  }

  // Eliminar un producto del carrito
  eliminarProducto(productoId: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/eliminar/${productoId}`, { headers: this.getHeaders() });
  }

  // Obtener el carrito del usuario
  obtenerCarrito(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl, { headers: this.getHeaders() });
  }
}
