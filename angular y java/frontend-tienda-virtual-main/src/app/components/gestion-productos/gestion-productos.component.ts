import { Component, OnInit } from '@angular/core';
import { ProductoService } from '../../services/producto.service';
import { AdminService } from '../../services/admin.service'; // Nueva importación
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Producto } from '../../models/producto';

@Component({
  selector: 'app-gestion-productos',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './gestion-productos.component.html',
  styleUrls: ['./gestion-productos.component.css'],
})
export class GestionProductosComponent implements OnInit {
  productos: Producto[] = [];
  categorias: any[] = []; // Lista de categorías
  nuevoProducto: Producto = new Producto('', '', '', 0, '', 0, '', null); // Añadimos categoria_id como null inicialmente
  editando = false;
  productoEditado: Producto = new Producto('', '', '', 0, '', 0, '', null);

  constructor(
    private productoService: ProductoService,
    private adminService: AdminService, // Nueva inyección
    private router: Router
  ) {}

  ngOnInit() {
    if (!localStorage.getItem('token')) {
      this.router.navigate(['/login']);
      return;
    }
    this.cargarProductos();
    this.cargarCategorias();
  }

  cargarProductos() {
    this.productoService.listarProductos(1, 10).subscribe({
      next: (response) => {
        this.productos = response;
      },
      error: (error) => {
        console.error('Error al cargar productos:', error);
      },
    });
  }

  cargarCategorias() {
    this.adminService.listarCategorias().subscribe({
      next: (response) => {
        this.categorias = response;
      },
      error: (error) => {
        console.error('Error al cargar categorías:', error);
        alert('Error al cargar categorías');
      },
    });
  }

  crearProducto() {
    console.log(this.nuevoProducto);
    this.productoService.crearProducto(this.nuevoProducto).subscribe({
      next: (response) => {
        console.log('Producto creado:', response);
        this.cargarProductos();
        this.nuevoProducto = new Producto('', '', '', 0, '', 0, '', null);
      },
      error: (error) => {
        console.error('Error al crear producto:', error);
        alert('Error al crear producto');
      },
    });
  }

  editarProducto(producto: Producto) {
    this.editando = true;
    this.productoEditado = { ...producto };
  }

  actualizarProducto() {
    this.productoService.actualizarProducto(this.productoEditado.id, this.productoEditado).subscribe({
      next: (response) => {
        console.log('Producto actualizado:', response);
        this.cargarProductos();
        this.editando = false;
        this.productoEditado = new Producto('', '', '', 0, '', 0, '', null);
      },
      error: (error) => {
        console.error('Error al actualizar producto:', error);
        alert('Error al actualizar producto');
      },
    });
  }

  eliminarProducto(id: string) {
    this.productoService.eliminarProducto(id).subscribe({
      next: (response) => {
        console.log('Producto eliminado:', response);
        this.cargarProductos();
      },
      error: (error) => {
        console.error('Error al eliminar producto:', error);
        alert('Error al eliminar producto');
      },
    });
  }
}
