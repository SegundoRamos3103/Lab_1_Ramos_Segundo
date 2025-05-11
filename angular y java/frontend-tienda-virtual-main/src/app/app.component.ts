import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterOutlet, Router } from '@angular/router'; // Añadimos Router

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterOutlet],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'tienda-virtual-frontend';

  constructor(private router: Router) {} // Inyectamos Router para redirigir
  ngOnInit() {
    this.cerrarSesion();
  }
  get usuarioRol(): string | null {
    return localStorage.getItem('rol');
  }

  get estaAutenticado(): boolean {
    return !!localStorage.getItem('token'); // Verifica si hay un token
  }

  cerrarSesion() {
    localStorage.removeItem('token');
    localStorage.removeItem('rol');
    this.router.navigate(['/login']); // Redirige al login
  }
}
