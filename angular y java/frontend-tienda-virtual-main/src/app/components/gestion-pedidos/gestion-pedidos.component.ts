import { Component, OnInit } from '@angular/core';
import { PedidoService } from '../../services/pedido.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-gestion-pedidos',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './gestion-pedidos.component.html',
  styleUrls: ['./gestion-pedidos.component.css'],
})
export class GestionPedidosComponent implements OnInit {
  pedidos: any[] = [];
  pedidoEditado: any = null;

  constructor(private pedidoService: PedidoService) {}

  ngOnInit() {
    this.cargarPedidos();
  }

  cargarPedidos() {
    this.pedidoService.obtenerTodosPedidos().subscribe({
      next: (response) => {
        this.pedidos = response;
      },
      error: (error) => {
        console.error('Error al cargar pedidos:', error);
        alert(`Error: ${error.error?.mensaje || 'No se pudo cargar los pedidos'}`);
      },
    });
  }

  editarPedido(pedido: any) {
    this.pedidoEditado = { ...pedido, transportista: pedido.transportista || '', numero_seguimiento: pedido.numero_seguimiento || '' };
  }

  guardarCambios() {
    if (this.pedidoEditado) {
      this.pedidoService
        .actualizarEstado(
          this.pedidoEditado.id,
          this.pedidoEditado.estado,
          this.pedidoEditado.transportista,
          this.pedidoEditado.numero_seguimiento
        )
        .subscribe({
          next: (response) => {
            console.log('Estado actualizado:', response);
            alert('Estado actualizado exitosamente');
            this.pedidoEditado = null;
            this.cargarPedidos();
          },
          error: (error) => {
            console.error('Error al actualizar estado:', error);
            alert(`Error: ${error.error?.mensaje || 'No se pudo actualizar el estado'}`);
          },
        });
    }
  }

  cancelarEdicion() {
    this.pedidoEditado = null;
  }
}
