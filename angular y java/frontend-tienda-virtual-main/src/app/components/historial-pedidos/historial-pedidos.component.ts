import { Component, OnInit } from '@angular/core';
import { PedidoService } from '../../services/pedido.service';
import { CommonModule } from '@angular/common';
import { CarouselModule } from 'ngx-bootstrap/carousel';
import { ProductoService } from '../../services/producto.service';
import { Producto } from '../../models/producto';
@Component({
  selector: 'app-historial-pedidos',
  standalone: true,
  imports: [CommonModule,CarouselModule],
  templateUrl: './historial-pedidos.component.html',
  styleUrls: ['./historial-pedidos.component.css'],
})
export class HistorialPedidosComponent implements OnInit {
  pedidos: any[] = [];


  constructor(
    private pedidoService: PedidoService,
    private productoService: ProductoService
  ) {}

  ngOnInit() {
    this.cargarHistorial();
  }

  cargarHistorial() {
    this.pedidoService.obtenerHistorial().subscribe({
      next: (response) => {
        this.pedidos = response;
        this.pedidos.forEach((pedido) => {
          pedido.detalles.forEach((detalle: any) => {
            this.productoService.obtenerProductoPorId(detalle.producto_id).subscribe({
              next: (producto: Producto) => {
                detalle.imagen = producto?.imagenes || ''; // Asigna la imagen o cadena vacía si no hay
              },
              error: (error) => {
                console.error('Error al buscar producto:', error);
                detalle.imagen = '';
              }
            });
          });
        });
        this.pedidos = this.pedidosFiltrados();
      },
      error: (error) => {
        console.error('Error al cargar historial:', error);
        alert(`Error: ${error.error?.mensaje || 'No se pudo cargar el historial'}`);
      },
    });
  }
  
  
  
  

  cancelarPedido(pedidoId: string) {
    if (confirm('¿Estás seguro de que quieres cancelar este pedido?')) {
      this.pedidoService.cancelarPedido(pedidoId).subscribe({
        next: (response) => {
          console.log('Pedido cancelado:', response);
          alert('Pedido cancelado exitosamente');
          this.cargarHistorial(); // Refrescar el historial
        },
        error: (error) => {
          console.error('Error al cancelar pedido:', error);
          alert(`Error: ${error.error?.mensaje || 'No se pudo cancelar el pedido'}`);
        },
      });
    }
  }

  pedidosFiltrados() {
    return this.pedidos ? this.pedidos.filter(p => p.estado !== 'Cancelado') : [];
}

}
