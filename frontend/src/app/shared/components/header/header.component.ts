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

  // Lógica del desplegable
  isLangMenuOpen: boolean = false;

  // Nuestra lista de idiomas
  languages = [
    { code: 'es', name: 'ES', flag: 'https://upload.wikimedia.org/wikipedia/commons/9/9a/Flag_of_Spain.svg' },
    { code: 'en', name: 'EN', flag: 'https://upload.wikimedia.org/wikipedia/en/a/ae/Flag_of_the_United_Kingdom.svg' }
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
}
