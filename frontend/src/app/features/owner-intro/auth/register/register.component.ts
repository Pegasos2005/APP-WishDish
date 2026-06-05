import { Component, AfterViewInit } from '@angular/core';
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
export class RegisterComponent implements AfterViewInit {
  // Control de las Fases
  registrationStep: 1 | 2 = 1;

  // Datos del Usuario y Restaurante
  firstName: string = '';
  lastName: string = '';
  phone: string = '';
  restaurantName: string = '';
  city: string = '';
  country: string = '';

  // Credenciales
  email: string = '';
  password: string = '';
  confirmPassword: string = '';
  errorMessage: string = '';

  // Controladores visuales
  showPassword: boolean = false;
  showConfirmPassword: boolean = false;

  // Variables para el SMS
  smsCode: string = '';
  appVerifier: any;
  confirmationResult: any;

  // UID temporal (lo guardamos en el paso 1 para usarlo en el paso 2)
  tempUid: string = '';

  constructor(private authService: AuthService, private router: Router) {}

  ngAfterViewInit() {
    // Preparamos el escudo invisible de Google para evitar spam de SMS
    this.appVerifier = this.authService.setupRecaptcha('recaptcha-register');
  }

  togglePassword() { this.showPassword = !this.showPassword; }
  toggleConfirmPassword() { this.showConfirmPassword = !this.showConfirmPassword; }

  // ==========================================
  // FASE 1: Crear Cuenta (Email) y Enviar SMS
  // ==========================================
  onStep1Submit() {
    if (!this.firstName || !this.lastName || !this.restaurantName || !this.phone || !this.email || !this.password) {
      this.errorMessage = 'Por favor, rellena todos los campos obligatorios.';
      return;
    }
    if (this.password !== this.confirmPassword) {
      this.errorMessage = 'Las contraseñas no coinciden.';
      return;
    }

    // Limpiamos el número de teléfono
    const cleanPhone = this.phone.replace(/[\s-]/g, '');

    // 1. Creamos la cuenta en Firebase Auth (esto lo loguea automáticamente)
    this.authService.register(this.email, this.password)
      .then((userCredential) => {
        this.tempUid = userCredential.user.uid;

        // 2. Vinculamos el teléfono y enviamos el SMS
        return this.authService.linkPhoneToAccount(cleanPhone, this.appVerifier);
      })
      .then((result) => {
        // ¡Éxito! El SMS va en camino. Pasamos a la Fase 2.
        this.confirmationResult = result;
        this.registrationStep = 2;
        this.errorMessage = '';
      })
      .catch(err => {
        if (err.code === 'auth/email-already-in-use') {
          this.errorMessage = 'Este correo ya está registrado.';
        } else if (err.code === 'auth/credential-already-in-use') {
          this.errorMessage = 'Este número de teléfono ya está vinculado a otra cuenta.';
        } else {
          this.errorMessage = 'Error: ' + err.message;
        }
        console.error(err);
      });
  }

  // ==========================================
  // FASE 2: Verificar PIN y Guardar en Firestore
  // ==========================================
  onVerifySms() {
    if (!this.smsCode || this.smsCode.length !== 6) {
      this.errorMessage = 'El código debe tener 6 dígitos';
      return;
    }

    // Comprobamos si el código que ha puesto coincide con el SMS
    this.confirmationResult.confirm(this.smsCode)
      .then(() => {
        // ¡Teléfono vinculado con éxito! Ahora guardamos todo en la base de datos
        const cleanPhone = this.phone.replace(/[\s-]/g, '');
        const ownerProfile = {
          firstName: this.firstName,
          lastName: this.lastName,
          phone: cleanPhone, // Guardamos el limpio por seguridad
          restaurantName: this.restaurantName,
          city: this.city,
          country: this.country,
          email: this.email,
          role: 'OWNER',
          createdAt: new Date().toISOString()
        };

        return this.authService.saveOwnerData(this.tempUid, ownerProfile);
      })
      .then(() => {
        console.log('¡Cuenta creada, teléfono vinculado y datos en Firestore!');
        this.router.navigate(['/owner-intro']);
      })
      .catch((err: any) => {
        this.errorMessage = 'Código incorrecto. Inténtalo de nuevo.';
      });
  }

  goToLogin() {
    this.router.navigate(['/owner-intro/login']);
  }
}
