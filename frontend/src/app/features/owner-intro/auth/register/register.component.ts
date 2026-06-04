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
  // Datos del Usuario
  firstName: string = '';
  lastName: string = '';
  phone: string = '';

  // Datos del Restaurante
  restaurantName: string = '';
  city: string = '';
  country: string = '';

  // Credenciales
  email: string = '';
  password: string = '';
  confirmPassword: string = '';
  errorMessage: string = '';

  // Controladores independientes para los ojitos
  showPassword: boolean = false;
  showConfirmPassword: boolean = false;

  constructor(private authService: AuthService, private router: Router) {}

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  toggleConfirmPassword() {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  onSubmit() {
    // 1. Validaciones previas
    if (!this.firstName || !this.lastName || !this.restaurantName || !this.email || !this.password || !this.confirmPassword) {
      this.errorMessage = 'Por favor, rellena todos los campos obligatorios.';
      return;
    }

    if (this.password !== this.confirmPassword) {
      this.errorMessage = 'Las contraseñas no coinciden.';
      return;
    }

    // 2. Llamada a Firebase (Más adelante guardaremos el resto de datos en la DB)
    this.authService.register(this.email, this.password)
      .then((userCredential) => {
            // ¡Éxito en Auth! Extraemos el UID único del nuevo usuario
            const uid = userCredential.user.uid;

            // Preparamos el paquete de datos para Firestore
            const ownerProfile = {
              firstName: this.firstName,
              lastName: this.lastName,
              phone: this.phone,
              restaurantName: this.restaurantName,
              city: this.city,
              country: this.country,
              email: this.email,
              role: 'OWNER', // Etiqueta muy útil para el futuro
              createdAt: new Date().toISOString() // Fecha de registro
            };

            // Guardamos en Firestore usando nuestra nueva función
            return this.authService.saveOwnerData(uid, ownerProfile);
          })
      .then(() => {
        console.log('¡Cuenta creada! Datos listos para guardar en DB:', {
          user: `${this.firstName} ${this.lastName}`,
          phone: this.phone,
          restaurant: this.restaurantName,
          location: `${this.city}, ${this.country}`
        });
        this.router.navigate(['/owner-intro']);
      })
      .catch(err => {
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
