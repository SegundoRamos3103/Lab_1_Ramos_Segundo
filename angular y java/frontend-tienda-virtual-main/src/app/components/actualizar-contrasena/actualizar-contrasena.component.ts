import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-actualizar-contrasena',
  standalone: true,
  imports: [FormsModule,RouterLink],
  templateUrl: './actualizar-contrasena.component.html',
  styleUrls: ['./actualizar-contrasena.component.css'],
})
export class ActualizarContrasenaComponent {
  contrasena = {
    actual: '',
    nueva: '',
  };

  constructor(private authService: AuthService, private router: Router) {}

  actualizarContrasena() {
    this.authService.actualizarContrasena(this.contrasena.nueva).subscribe({
      next: (response) => {
        console.log('Contraseña actualizada:', response);
        alert('Contraseña actualizada exitosamente');
        this.router.navigate(['/perfil']);
      },
      error: (error) => {
        console.error('Error al actualizar contraseña:', error);
        alert('Error al actualizar contraseña');
      },
    });
  }
}
