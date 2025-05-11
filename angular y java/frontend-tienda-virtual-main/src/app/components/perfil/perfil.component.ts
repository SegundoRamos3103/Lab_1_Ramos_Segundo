import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { Usuario } from '../../models/usuario';

@Component({
  selector: 'app-perfil',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.css'],
})
export class PerfilComponent implements OnInit {
  usuario: Usuario | null = null;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit() {
    if (!localStorage.getItem('token')) {
      this.router.navigate(['/login']);
      return;
    }
    this.cargarUsuario();
  }

  cargarUsuario() {
    this.authService.obtenerUsuarioAutenticado().subscribe({
      next: (response) => {
        this.usuario = new Usuario(response.id, response.nombre, response.correo, response.direccion, response.rol);
      },
      error: (error) => {
        console.error('Error al cargar el usuario:', error);
        alert(`Error: ${error.error?.mensaje || 'No se pudo cargar la información del usuario'}`);
        this.router.navigate(['/login']);
      },
    });
  }
}
