import { Component, OnInit } from '@angular/core';
import { AdminService } from '../../services/admin.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-gestion-usuarios',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './gestion-usuarios.component.html',
  styleUrls: ['./gestion-usuarios.component.css'],
})
export class GestionUsuariosComponent implements OnInit {
  usuarios: any[] = [];

  constructor(private adminService: AdminService) {}

  ngOnInit() {
    this.cargarUsuarios();
  }

  cargarUsuarios() {
    this.adminService.listarUsuarios().subscribe({
      next: (response) => {
        this.usuarios = response;
      },
      error: (error) => {
        console.error('Error al cargar usuarios:', error);
        alert(`Error: ${error.error?.mensaje || 'No se pudo cargar los usuarios'}`);
      },
    });
  }

  bloquearUsuario(usuarioId: string, bloquear: boolean) {
    if (confirm(`¿Estás seguro de que quieres ${bloquear ? 'bloquear' : 'desbloquear'} este usuario?`)) {
      this.adminService.bloquearUsuario(usuarioId, bloquear).subscribe({
        next: (response) => {
          console.log('Usuario actualizado:', response);
          alert(response.mensaje);
          this.cargarUsuarios();
        },
        error: (error) => {
          console.error('Error al bloquear usuario:', error);
          alert(`Error: ${error.error?.mensaje || 'No se pudo actualizar el usuario'}`);
        },
      });
    }
  }

  eliminarUsuario(usuarioId: string) {
    if (confirm('¿Estás seguro de que quieres eliminar este usuario?')) {
      this.adminService.eliminarUsuario(usuarioId).subscribe({
        next: (response) => {
          console.log('Usuario eliminado:', response);
          alert('Usuario eliminado exitosamente');
          this.cargarUsuarios();
        },
        error: (error) => {
          console.error('Error al eliminar usuario:', error);
          alert(`Error: ${error.error?.mensaje || 'No se pudo eliminar el usuario'}`);
        },
      });
    }
  }
}
