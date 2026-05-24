import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { environment } from '../environments/environment';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './app.html', // Ruta exacta a tu HTML
  styleUrls: ['./app.css']   // Ruta exacta a tu CSS
})
export class App implements OnInit { // <-- ¡Aquí está el cambio clave! (Antes era AppComponent)
  nombres: any[] = [];
  nuevoNombre: string = '';

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.cargarNombres();
  }

  cargarNombres() {
    this.http.get<any[]>(`${environment.apiUrl}test`).subscribe({
      next: (data) => this.nombres = data,
      error: (err) => console.error('Error al cargar', err)
    });
  }

  guardarNombre() {
    if (!this.nuevoNombre) return;

    const body = { nombre: this.nuevoNombre };
    this.http.post(`${environment.apiUrl}test`, body).subscribe({
      next: () => {
        this.nuevoNombre = '';
        this.cargarNombres();
      },
      error: (err) => console.error('Error al guardar', err)
    });
  }
}
