import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../../core/services/owner-intro/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  email: string = '';
  password: string = '';
  isRegistering: boolean = false; // Para alternar entre vista de login y registro
  errorMessage: string = '';

  constructor(private authService: AuthService, private router: Router) {}

  onSubmit() {
    if (this.isRegistering) {
      this.authService.register(this.email, this.password)
        .then(() => {
          console.log('¡Registrado con éxito!');
          // Si tiene éxito, lo mandamos a la pantalla de los 4 botones
          this.router.navigate(['/owner-intro']);
        })
        .catch(err => this.errorMessage = err.message);
    } else {
      this.authService.login(this.email, this.password)
        .then(() => {
          console.log('¡Logueado con éxito!');
          this.router.navigate(['/owner-intro']);
        })
        .catch(err => this.errorMessage = 'Credenciales incorrectas');
    }
  }
}
