import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  credenciales = {
    correo: '',
    contrasena: '',
  };

  constructor(private authService: AuthService, private router: Router) {}

  iniciarSesion() {
    console.log("Enviando credenciales:", this.credenciales);

    this.authService.iniciarSesion(this.credenciales).subscribe({
      next: (response) => {
        console.log("Inicio de sesión exitoso:", response);
        localStorage.setItem("token", response.token);
        // Decodificar el token para obtener el rol (usamos una libreria como jwt-decode o parseamos manualmente)
        const tokenPayload = JSON.parse(atob(response.token.split('.')[1]));
        localStorage.setItem("rol", tokenPayload.rol); // Guardar el rol en localStorage
        this.router.navigate(["/lista-productos"]);
      },
      error: (error) => {
        console.error("Error en la solicitud:", error);
        alert(`Error: ${error.error?.mensaje || "Error desconocido"}`);
      },
    });
  }
}
