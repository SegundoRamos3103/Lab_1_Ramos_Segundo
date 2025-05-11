import { Component, OnInit } from '@angular/core';
import { CarritoService } from '../../services/carrito.service';
import { PedidoService } from '../../services/pedido.service'; // Nueva importación
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-carrito',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './carrito.component.html',
  styleUrls: ['./carrito.component.css'],
})
export class CarritoComponent implements OnInit {
  carrito: any[] = [];

  constructor(private carritoService: CarritoService, private pedidoService: PedidoService) {}

  ngOnInit() {
    this.cargarCarrito();
  }

  cargarCarrito() {
    this.carritoService.obtenerCarrito().subscribe({
      next: (response) => {
        this.carrito = response;
      },
      error: (error) => {
        console.error('Error al cargar el carrito:', error);
        alert(`Error: ${error.error?.mensaje || 'No se pudo cargar el carrito'}`);
      },
    });
  }

  actualizarCantidad(productoId: string, cantidad: number) {
    if (cantidad < 1) return;
    this.carritoService.actualizarCantidad(productoId, cantidad).subscribe({
      next: (response) => {
        console.log('Cantidad actualizada:', response);
        this.cargarCarrito();
      },
      error: (error) => {
        console.error('Error al actualizar cantidad:', error);
        alert(`Error: ${error.error?.mensaje || 'No se pudo actualizar la cantidad'}`);
      },
    });
  }

  eliminarProducto(productoId: string) {
    this.carritoService.eliminarProducto(productoId).subscribe({
      next: (response) => {
        console.log('Producto eliminado:', response);
        this.cargarCarrito();
      },
      error: (error) => {
        console.error('Error al eliminar producto:', error);
        alert(`Error: ${error.error?.mensaje || 'No se pudo eliminar el producto'}`);
      },
    });
  }

  crearPedido() {
    this.pedidoService.crearPedido().subscribe({
      next: (response) => {
        console.log('Pedido creado:', response);
        alert('Pedido creado exitosamente');
        this.cargarCarrito(); // Refrescar el carrito (debería estar vacío ahora)
      },
      error: (error) => {
        console.error('Error al crear pedido:', error);
        alert(`Error: ${error.error?.mensaje || 'No se pudo crear el pedido'}`);
      },
    });
  }
}
