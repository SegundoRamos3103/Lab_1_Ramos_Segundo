import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Producto } from '../models/producto';

@Injectable({
  providedIn: 'root',
})
export class ProductoService {
  private apiUrl = 'https://backend-tienda-virtual-production.up.railway.app/api/productos';
  private carritoUrl = 'https://backend-tienda-virtual-production.up.railway.app/api/carrito'; // Nueva URL para el carrito

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
  }

  crearProducto(producto: Producto): Observable<any> {
    return this.http.post(this.apiUrl, producto, { headers: this.getHeaders() });
  }

  actualizarProducto(id: string, producto: Producto): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, producto, { headers: this.getHeaders() });
  }

  eliminarProducto(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`, { headers: this.getHeaders() });
  }

  listarProductos(pagina: number, limite: number): Observable<Producto[]> {
    return this.http.get<Producto[]>(`${this.apiUrl}?pagina=${pagina}&limite=${limite}`);
  }

  buscarProductos(filtros: any): Observable<Producto[]> {
    let params = '';
    for (const key in filtros) {
      if (filtros[key]) {
        params += `${key}=${encodeURIComponent(filtros[key])}&`;
      }
    }
    return this.http.get<Producto[]>(`${this.apiUrl}/buscar?${params}`);
  }

  agregarAlCarrito(productoId: string, cantidad: number): Observable<any> {
    return this.http.post(
      `${this.carritoUrl}/agregar`,
      { productoId, cantidad },
      { headers: this.getHeaders() }
    );
  }

  obtenerProductoPorId(id: string): Observable<Producto> {
    return this.http.get<Producto>(`${this.apiUrl}/${id}`);
  }
}
