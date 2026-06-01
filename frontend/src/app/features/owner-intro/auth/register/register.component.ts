import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../../core/services/owner-intro/auth.service';
import { Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, TranslateModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  email: string = '';
  password: string = '';
  confirmPassword: string = ''; // Nuevo campo vital
  errorMessage: string = '';

  showPassword: boolean = false; // Controla el ojito de ambas contraseñas

  constructor(private authService: AuthService, private router: Router) {}

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  onSubmit() {
    // 1. Validaciones previas
    if (!this.email || !this.password || !this.confirmPassword) {
      this.errorMessage = 'Por favor, rellena todos los campos.';
      return;
    }

    if (this.password !== this.confirmPassword) {
      this.errorMessage = 'Las contraseñas no coinciden.';
      return;
    }

    // 2. Llamada a Firebase
    this.authService.register(this.email, this.password)
      .then(() => {
        console.log('¡Restaurante registrado con éxito!');
        this.router.navigate(['/owner-intro']);
      })
      .catch(err => {
        // Firebase devuelve errores en inglés por defecto, aquí los capturamos
        if (err.code === 'auth/email-already-in-use') {
          this.errorMessage = 'Este correo ya está registrado.';
        } else if (err.code === 'auth/weak-password') {
          this.errorMessage = 'La contraseña debe tener al menos 6 caracteres.';
        } else {
          this.errorMessage = 'Error al registrar: ' + err.message;
        }
      });
  }

  goToLogin() {
    this.router.navigate(['/owner-intro/login']);
  }
}
