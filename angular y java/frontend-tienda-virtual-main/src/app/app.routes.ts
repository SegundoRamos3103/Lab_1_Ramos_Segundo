import { Routes } from '@angular/router';
import { RegistroComponent } from './components/registro/registro.component';
import { LoginComponent } from './components/login/login.component';
import { PerfilComponent } from './components/perfil/perfil.component';
import { ActualizarContrasenaComponent } from './components/actualizar-contrasena/actualizar-contrasena.component';
import { GestionProductosComponent } from './components/gestion-productos/gestion-productos.component';
import { ListaProductosComponent } from './components/lista-productos/lista-productos.component';
import { CarritoComponent } from './components/carrito/carrito.component';
import { HistorialPedidosComponent } from './components/historial-pedidos/historial-pedidos.component';
import { GestionPedidosComponent } from './components/gestion-pedidos/gestion-pedidos.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { GestionUsuariosComponent } from './components/gestion-usuarios/gestion-usuarios.component';
import { GestionCategoriasComponent } from './components/gestion-categorias/gestion-categorias.component';

export const routes: Routes = [
  { path: 'registro', component: RegistroComponent },
  { path: 'login', component: LoginComponent },
  { path: 'perfil', component: PerfilComponent },
  { path: 'actualizar-contrasena', component: ActualizarContrasenaComponent },
  { path: 'gestion-productos', component: GestionProductosComponent },
  { path: 'lista-productos', component: ListaProductosComponent },
  { path: 'carrito', component: CarritoComponent },
  { path: 'historial-pedidos', component: HistorialPedidosComponent },
  { path: 'gestion-pedidos', component: GestionPedidosComponent },
  { path: 'admin/dashboard', component: DashboardComponent }, // Nueva ruta
  { path: 'admin/usuarios', component: GestionUsuariosComponent }, // Nueva ruta
  { path: 'admin/categorias', component: GestionCategoriasComponent }, // Nueva ruta
  { path: '', redirectTo: '/login', pathMatch: 'full' },
];
