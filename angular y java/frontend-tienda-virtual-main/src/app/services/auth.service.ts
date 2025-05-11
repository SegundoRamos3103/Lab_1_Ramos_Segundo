import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Usuario } from '../models/usuario';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'https://backend-tienda-virtual-production.up.railway.app/api'; // URL del backend
  private usuarioSubject = new BehaviorSubject<Usuario | null>(null);

  constructor(private http: HttpClient) {}

  // Obtener el usuario actual como observable
  get usuario$(): Observable<Usuario | null> {
    return this.usuarioSubject.asObservable();
  }

  // Obtener el usuario actual como valor
  getUsuario(): Usuario | null {
    return this.usuarioSubject.value;
  }

  // Verificar si el usuario es admin
  esAdmin(): boolean {
    const usuario = this.getUsuario();
    return usuario?.rol === 'admin';
  }

  // Registrar un usuario
  registrarUsuario(usuario: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/auth/registrar`, usuario);
  }

  // Iniciar sesión
  iniciarSesion(credenciales: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/auth/iniciar-sesion`, credenciales).pipe(
      tap((response: any) => {
        const token = response.token;
        localStorage.setItem('token', token);

        // Decodificar el token para obtener la información del usuario
        const payload = JSON.parse(atob(token.split('.')[1]));
        const usuario = new Usuario(
          payload.id,
          '', // Nombre no está en el token, podrías extender el backend para incluirlo
          credenciales.correo, // Usamos el correo del formulario
          '', // Dirección no está en el token
          payload.rol
        );
        this.usuarioSubject.next(usuario);
      })
    );
  }

  // Cerrar sesión
  cerrarSesion() {
    localStorage.removeItem('token');
    this.usuarioSubject.next(null);
  }

  // Actualizar información del usuario
  actualizarUsuario(datos: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/usuario/actualizar`, datos, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
    });
  }

  // Actualizar contraseña
  actualizarContrasena(contrasena: string): Observable<any> {
    return this.http.put(
      `${this.apiUrl}/usuario/actualizar-contrasena`,
      { contrasena },
      { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
    );
  }
  // Nuevo método para obtener la información del usuario autenticado
  obtenerUsuarioAutenticado(): Observable<Usuario> {
    return this.http.get<Usuario>(`${this.apiUrl}/usuario/perfil`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
    });
  }
}
