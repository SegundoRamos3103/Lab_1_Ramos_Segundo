import { Component, OnInit } from '@angular/core';
import { AdminService } from '../../services/admin.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit {
  estadisticas: any = {};

  constructor(private adminService: AdminService) {}

  ngOnInit() {
    this.cargarEstadisticas();
  }

  cargarEstadisticas() {
    this.adminService.obtenerEstadisticas().subscribe({
      next: (response) => {
        this.estadisticas = response;
      },
      error: (error) => {
        console.error('Error al cargar estadísticas:', error);
        alert(`Error: ${error.error?.mensaje || 'No se pudo cargar las estadísticas'}`);
      },
    });
  }
}
