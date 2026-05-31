import { Component } from '@angular/core';
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
  email: string = '';
  password: string = '';
  errorMessage: string = '';
  showPassword: boolean = false;

  constructor(private authService: AuthService, private router: Router) {}

  onSubmit() {
    this.authService.login(this.email, this.password)
      .then(() => {
        console.log('¡Logueado con éxito!');
        this.router.navigate(['/owner-intro']); // O la ruta principal que decidas luego
      })
      .catch(err => this.errorMessage = 'Credenciales incorrectas');
  }

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  goToRegister() {
    // Redirige a la futura pantalla de registro
    this.router.navigate(['/owner-intro/register']);
  }
}
