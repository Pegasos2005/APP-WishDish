import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../../core/services/owner-intro/auth.service';
import { filter } from 'rxjs';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, TranslateModule], // <- Importamos TranslateModule aquí
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
  showBackButton: boolean = true;
  showWelcomeText: boolean = true;
  userName: string = '';
  isDarkMode: boolean = true;
  isLangMenuOpen: boolean = false;
  languages = [
    { code: 'en', name: 'English', flag: '/header/flags/united-kingdom.svg' },
    { code: 'es', name: 'Español', flag: '/header/flags/spain.svg' },
    { code: 'de', name: 'Deutsch', flag: '/header/flags/germany.svg' },
    { code: 'sv', name: 'Svenska', flag: '/header/flags/sweden.svg' },
    { code: 'fr', name: 'Français', flag: '/header/flags/france.svg' }
  ];
  currentLang = this.languages[0]; // Idioma seleccionado por defecto

  constructor(private authService: AuthService, private translate: TranslateService, private router: Router, private activatedRoute: ActivatedRoute) {
    // Le decimos q empiece en oscuro
    document.body.classList.add('dark');
    // Le decimos a Angular q empiece en inglés
    this.translate.setDefaultLang('en'); // X seguridad, si hay algúna palabra o idioma no declaradado, la busca en el diccionario inglés
    this.translate.use('en'); // El idioma del usuario en la página

    // --- NUEVA LÓGICA DEL HEADER DINÁMICO ---
    // Escuchador de Rutas (Oculta botones en función de lo definido en app.routes.ts)
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {

      // Buscamos cuál es la ruta hija final en la que estamos (ej. /owner-intro/login)
      let currentRoute = this.activatedRoute.root;
      while (currentRoute.firstChild) {
        currentRoute = currentRoute.firstChild;
      }

      // Extraemos la información (data) de esa ruta exacta
      const data = currentRoute.snapshot.data;

      // Actualizamos las variables. Si la ruta no dice nada, por defecto serán true.
      this.showBackButton = data['showBackButton'] ?? true;
      this.showWelcomeText = data['showWelcomeText'] ?? true;
    });

    // 2. NUEVO: Escuchador de Usuario
    this.authService.user$.subscribe(async (user) => {
      if (user) {
        // Si hay un usuario logueado, vamos a Firestore a por su nombre
        const profile = await this.authService.getOwnerProfile(user.uid);
        if (profile && profile['firstName']) {
          this.userName = profile['firstName'];
        } else {
          this.userName = 'Undefined name'
        }
      } else {
        // Si no hay nadie logueado (cerró sesión), limpiamos el nombre
        this.userName = 'User not register';
      }
    });
  }

  goBack() {
    window.history.back();
  }

  toggleLangMenu() {
    this.isLangMenuOpen = !this.isLangMenuOpen;
  }

  changeLanguage(lang: any) {
    const notImplemented = ['de', 'sv', 'fr'];
    if (notImplemented.includes(lang.code)) {
      alert("This language is not implemented yet");
      this.isLangMenuOpen = false;
      return;
    }
    this.currentLang = lang;
    this.translate.use(lang.code); // Esta línea cambia toda la web de idioma
    this.isLangMenuOpen = false;   // Cerramos el menú
  }

  toggleDarkMode() {
    this.isDarkMode = !this.isDarkMode;

    // Inyectamos o quitamos la clase 'dark' del cuerpo principal de la web
    if (this.isDarkMode) {
      document.body.classList.add('dark');
    } else {
      document.body.classList.remove('dark');
    }
  }
}
