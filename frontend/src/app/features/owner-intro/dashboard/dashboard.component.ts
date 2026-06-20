import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, TranslateModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent {

  // Variables para controlar las ventanas modales
  showManualLinkModal: boolean = false;
  showServiceModal: boolean = false;

  // Variable para guardar la IP que introduzca el usuario
  targetIp: string = '';

  constructor(private router: Router) {}

  // 1. Botón: New Local
  createNewLocal() {
    // Más adelante crearemos este componente
    this.router.navigate(['/owner-intro/new-local']);
  }

  // 2. Botón: Auto-Link
  autoLinkDevice() {
    console.log('Iniciando barrido de red para buscar la Base de Datos Desktop...');
    // Aquí irá la lógica de escaneo de red en el futuro
    alert('Buscando servidor en la red local... (Función en desarrollo)');
  }

  // 3. Botones: Manual Link (IP)
  openManualLink() { this.showManualLinkModal = true; }
  closeManualLink() { this.showManualLinkModal = false; this.targetIp = ''; }

  connectToIp() {
    console.log('Intentando conectar a la IP:', this.targetIp);
    // Lógica de conexión a IP futura
    this.closeManualLink();
  }

  // 4. Botones: Pro Setup Service
  openServiceSetup() { this.showServiceModal = true; }
  closeServiceSetup() { this.showServiceModal = false; }
}
