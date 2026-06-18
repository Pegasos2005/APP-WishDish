// AfterViewInit login movil
import { Component, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../../core/services/owner-intro/auth.service';
import { Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, TranslateModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  // Modo de inicio de sesión actual
  loginMode: 'email' | 'phone' = 'email';

  // Datos para Email
  email: string = '';
  password: string = '';
  showPassword: boolean = false;

  // Datos para Teléfono
  phone: string = '';
  smsCode: string = '';
  codeSent: boolean = false; // Nos dirá si ya hemos enviado el SMS
  appVerifier: any; // Guardará el verificador de reCAPTCHA
  confirmationResult: any; // Guardará la respuesta de Firebase al enviar el SMS

  errorMessage: string = '';

  constructor(private authService: AuthService, private router: Router) {}

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  // Se ejecuta justo cuando el HTML ha terminado de cargar en pantalla
  ngAfterViewInit() {
    // Configuramos el reCAPTCHA invisible apuntando al <div> que crearemos en el HTML
    this.appVerifier = this.authService.setupRecaptcha('recaptcha-container');
  }

  switchMode(mode: 'email' | 'phone') {
    this.loginMode = mode;
    this.errorMessage = '';
    this.codeSent = false;
  }

  // --- LOGIN CON EMAIL ---
  onEmailSubmit() {
    this.authService.login(this.email, this.password)
      .then(async (userCredential) => {

        // --- CONTROL DE ADUANAS PARA CUENTAS FANTASMA ---
        const uid = userCredential.user.uid;
        const profile = await this.authService.getOwnerProfile(uid);

        if (!profile) {
          // ¡Cazado! Es un usuario que cerró la pestaña a mitad del registro.
          // Borramos esta cuenta inútil al instante.
          try {
            await this.authService.deleteCurrentUser();
          } catch(e) {}

          this.authService.logout(); // Cerramos su sesión
          this.errorMessage = 'Tu registro anterior no se completó. Por favor, vuelve a la pantalla de registro para crear tu cuenta correctamente.';
          return; // Cortamos la ejecución, no le dejamos entrar
        }
        // ------------------------------------------------

        // Si tiene perfil, es un usuario legítimo. Le dejamos pasar.
        this.router.navigate(['/owner-intro']);
      })
      .catch(err => {
        this.errorMessage = 'Credenciales incorrectas';
      });
  }

  // --- FLUJO DE TELÉFONO ---
  onSendSms() {
    if (!this.phone) {
      this.errorMessage = 'Introduce un número de teléfono válido (incluye prefijo, ej: +34)';
      return;
    }

    // 🧹 MAGIA AQUÍ: Quitamos todos los espacios en blanco y guiones que haya puesto el usuario
    const cleanPhone = this.phone.replace(/[\s-]/g, '');

    // Comprobamos si empieza por + y tiene al menos 8 dígitos (ej: +34123456)
    if (!cleanPhone.startsWith('+') || cleanPhone.length < 9) {
      this.errorMessage = 'El teléfono debe incluir un prefijo internacional válido (ej: +34).';
      return;
    }

    this.authService.sendSmsCode(this.phone, this.appVerifier)
      .then((result) => {
        this.confirmationResult = result;
        this.codeSent = true;
        this.errorMessage = '';
      })
      .catch(err => {
        this.errorMessage = 'Error al enviar SMS. Compruebe que ha escrito correctamente su número de teléfono.';
        console.error(err);
      });
  }

  onVerifyCode() {
    if (!this.smsCode || this.smsCode.length !== 6) {
      this.errorMessage = 'El código debe tener 6 dígitos';
      return;
    }

    this.confirmationResult.confirm(this.smsCode)
      .then(() => {
        this.router.navigate(['/owner-intro']);
      })
      .catch((err: any) => {
        this.errorMessage = 'Código incorrecto o caducado.';
      });
  }

  goToRegister() {
    // Redirige a la futura pantalla de registro
    this.router.navigate(['/owner-intro/register']);
  }
}
