import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, TranslateModule], // <- Importamos TranslateModule aquí
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {
  showBackButton: boolean = true;
  userName: string = 'Paco'; // Más adelante esto vendrá de Firebase
  isDarkMode: boolean = false;

  // Lógica del desplegable
  isLangMenuOpen: boolean = false;

  // Nuestra lista de idiomas
  languages = [
    { code: 'es', name: 'ES', flag: '/header/flags/spain.svg' },
    { code: 'en', name: 'EN', flag: '/header/flags/united-kingdom.svg' }
  ];

  // Idioma seleccionado por defecto
  currentLang = this.languages[0];

  constructor(private translate: TranslateService) {
    // Le decimos a Angular que empiece en español
    this.translate.setDefaultLang('es');
    this.translate.use('es');
  }

  goBack() {
    window.history.back();
  }

  toggleLangMenu() {
    this.isLangMenuOpen = !this.isLangMenuOpen;
  }

  changeLanguage(lang: any) {
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
