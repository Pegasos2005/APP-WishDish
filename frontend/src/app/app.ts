import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

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
    this.http.get<any[]>('http://localhost:8080/api/test').subscribe({
      next: (data) => this.nombres = data,
      error: (err) => console.error('Error al cargar', err)
    });
  }

  guardarNombre() {
    if (!this.nuevoNombre) return;

    const body = { nombre: this.nuevoNombre };
    this.http.post('http://localhost:8080/api/test', body).subscribe({
      next: () => {
        this.nuevoNombre = '';
        this.cargarNombres();
      },
      error: (err) => console.error('Error al guardar', err)
    });
  }
}
