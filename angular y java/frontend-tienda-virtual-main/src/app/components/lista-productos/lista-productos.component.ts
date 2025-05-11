import { Component, OnInit } from '@angular/core';
import { ProductoService } from '../../services/producto.service';
import { AdminService } from '../../services/admin.service'; // Nueva importación
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Producto } from '../../models/producto';
import { CarouselModule } from 'ngx-bootstrap/carousel';

@Component({
  selector: 'app-lista-productos',
  standalone: true,
  imports: [FormsModule, CommonModule,CarouselModule],
  templateUrl: './lista-productos.component.html',
  styleUrls: ['./lista-productos.component.css'],
})
export class ListaProductosComponent implements OnInit {
  productos: Producto[] = [];
  categorias: any[] = []; // Lista de categorías
  filtros = {
    categoria_id: '', // Cambiamos a categoria_id
    precioMin: '',
    precioMax: '',
    nombre: '',
    ordenarPor: 'precio',
    orden: 'ASC',
  };

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
    this.cargarCategorias();
    this.buscarProductos();
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

  buscarProductos() {
    this.productoService.buscarProductos(this.filtros).subscribe({
      next: (response) => {
        this.productos = response;
      },
      error: (error) => {
        console.error('Error al buscar productos:', error);
        alert(`Error: ${error.error?.mensaje || 'Error al cargar productos'}`);
      },
    });
  }

  agregarAlCarrito(productoId: string) {
    this.productoService.agregarAlCarrito(productoId, 1).subscribe({
      next: (response) => {
        console.log('Producto agregado al carrito:', response);
        alert('Producto agregado al carrito');
        this.buscarProductos();
      },
      error: (error) => {
        console.error('Error al agregar al carrito:', error);
        alert(`Error: ${error.error?.mensaje || 'No se pudo agregar al carrito'}`);
      },
    });
  }
}
