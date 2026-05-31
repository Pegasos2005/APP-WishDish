import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { filter } from 'rxjs';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, TranslateModule], // <- Importamos TranslateModule aquí
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {
  showBackButton: boolean = true;
  welcomeText: boolean = true;
  userName: string = 'Paco'; // Más adelante esto vendrá de Firebase
  isDarkMode: boolean = false;

  // Lógica del desplegable
  isLangMenuOpen: boolean = false;

  // Nuestra lista de idiomas
  languages = [
    { code: 'en', name: 'English', flag: '/header/flags/united-kingdom.svg' },
    { code: 'es', name: 'Español', flag: '/header/flags/spain.svg' },
    { code: 'de', name: 'Deutsch', flag: '/header/flags/germany.svg' },
    { code: 'sv', name: 'Svenska', flag: '/header/flags/sweden.svg' },
    { code: 'fr', name: 'Français', flag: '/header/flags/france.svg' }
  ];

  // Idioma seleccionado por defecto
  currentLang = this.languages[0];

  constructor(private translate: TranslateService, private router: Router, private activatedRoute: ActivatedRoute) {
    // Le decimos a Angular que empiece en inglés (lo que ya tenías)
    this.translate.setDefaultLang('en');
    this.translate.use('en');

    // --- NUEVA LÓGICA DEL HEADER DINÁMICO ---
    // Escuchamos cada vez que el usuario termina de navegar a una nueva pantalla
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
      this.welcomeText = data['welcomeText'] ?? true;
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
