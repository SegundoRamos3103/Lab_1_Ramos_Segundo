import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import {CommonModule} from '@angular/common';

@Component({
  selector: 'app-registro',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.css'],
})
export class RegistroComponent {
  usuario = {
    nombre: '',
    correo: '',
    contrasena: '',
    direccion: '',
    rol: 'cliente',
  };

  // Objeto para manejar errores
  errores = {
    nombre: '',
    correo: '',
    contrasena: '',
    direccion: ''
  };

  constructor(private authService: AuthService, private router: Router) {}

  // Función para validar email
  validarEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  // Función de validación antes de enviar
  validarFormulario(): boolean {
    let isValid = true;
    this.resetErrores();

    // Validar nombre
    if (!this.usuario.nombre.trim()) {
      this.errores.nombre = 'El nombre es requerido';
      isValid = false;
    }

    // Validar correo
    if (!this.usuario.correo.trim()) {
      this.errores.correo = 'El correo es requerido';
      isValid = false;
    } else if (!this.validarEmail(this.usuario.correo)) {
      this.errores.correo = 'El correo no es válido';
      isValid = false;
    }

    // Validar contraseña
    if (!this.usuario.contrasena.trim()) {
      this.errores.contrasena = 'La contraseña es requerida';
      isValid = false;
    } else if (this.usuario.contrasena.length < 6) {
      this.errores.contrasena = 'La contraseña debe tener al menos 6 caracteres';
      isValid = false;
    }

    // Validar dirección
    if (!this.usuario.direccion.trim()) {
      this.errores.direccion = 'La dirección es requerida';
      isValid = false;
    }

    return isValid;
  }

  // Resetear mensajes de error
  resetErrores() {
    this.errores = {
      nombre: '',
      correo: '',
      contrasena: '',
      direccion: ''
    };
  }

  registrar() {
    if (!this.validarFormulario()) {
      return;
    }

    this.authService.registrarUsuario(this.usuario).subscribe({
      next: (response) => {
        console.log('Registro exitoso:', response);
        alert('Usuario registrado exitosamente');
        this.router.navigate(['/login']);
      },
      error: (error) => {
        console.error('Error en el registro:', error);
        alert(`Error: ${error.error.mensaje || 'Error desconocido'}`);
      },
    });
  }
}
