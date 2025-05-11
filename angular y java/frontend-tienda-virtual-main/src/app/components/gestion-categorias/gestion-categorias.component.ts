import { Component, OnInit } from '@angular/core';
import { AdminService } from '../../services/admin.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-gestion-categorias',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './gestion-categorias.component.html',
  styleUrls: ['./gestion-categorias.component.css'],
})
export class GestionCategoriasComponent implements OnInit {
  categorias: any[] = [];
  nuevaCategoria = { nombre: '', descripcion: '' };
  categoriaEditada: any = null;

  constructor(private adminService: AdminService) {}

  ngOnInit() {
    this.cargarCategorias();
  }

  cargarCategorias() {
    this.adminService.listarCategorias().subscribe({
      next: (response) => {
        this.categorias = response;
      },
      error: (error) => {
        console.error('Error al cargar categorías:', error);
        alert(`Error: ${error.error?.mensaje || 'No se pudo cargar las categorías'}`);
      },
    });
  }

  crearCategoria() {
    this.adminService.crearCategoria(this.nuevaCategoria.nombre, this.nuevaCategoria.descripcion).subscribe({
      next: (response) => {
        console.log('Categoría creada:', response);
        alert('Categoría creada exitosamente');
        this.nuevaCategoria = { nombre: '', descripcion: '' };
        this.cargarCategorias();
      },
      error: (error) => {
        console.error('Error al crear categoría:', error);
        alert(`Error: ${error.error?.mensaje || 'No se pudo crear la categoría'}`);
      },
    });
  }

  editarCategoria(categoria: any) {
    this.categoriaEditada = { ...categoria };
  }

  actualizarCategoria() {
    if (this.categoriaEditada) {
      this.adminService
        .actualizarCategoria(this.categoriaEditada.id, this.categoriaEditada.nombre, this.categoriaEditada.descripcion)
        .subscribe({
          next: (response) => {
            console.log('Categoría actualizada:', response);
            alert('Categoría actualizada exitosamente');
            this.categoriaEditada = null;
            this.cargarCategorias();
          },
          error: (error) => {
            console.error('Error al actualizar categoría:', error);
            alert(`Error: ${error.error?.mensaje || 'No se pudo actualizar la categoría'}`);
          },
        });
    }
  }

  eliminarCategoria(categoriaId: string) {
    if (confirm('¿Estás seguro de que quieres eliminar esta categoría?')) {
      this.adminService.eliminarCategoria(categoriaId).subscribe({
        next: (response) => {
          console.log('Categoría eliminada:', response);
          alert('Categoría eliminada exitosamente');
          this.cargarCategorias();
        },
        error: (error) => {
          console.error('Error al eliminar categoría:', error);
          alert(`Error: ${error.error?.mensaje || 'No se pudo eliminar la categoría'}`);
        },
      });
    }
  }
}
