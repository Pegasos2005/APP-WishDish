import { provideRouter, withComponentInputBinding } from '@angular/router';
import { Routes } from '@angular/router';

export const routes: Routes = [
  // 1. Si entran a la raíz, los mandamos a owner-intro/login
  {
    path: '',
    redirectTo: 'owner-intro/login',
    pathMatch: 'full'
  },

  // 2. Ruta Padre (El Layout que contiene el Header)
  {
    path: 'owner-intro',
    loadComponent: () => import('./shared/layouts/main-layout/main-layout.component').then(m => m.MainLayoutComponent),

    // 3. Rutas Hijas (Se incrustarán debajo del Header)
    children: [
      {
        path: 'login', // La ruta real será: localhost:4200/owner-intro/login
        loadComponent: () => import('./features/owner-intro/auth/login/login.component').then(m => m.LoginComponent),
        data: { showBackButton: false, welcomeText: false  }
      },
      {
        path: 'register',
        loadComponent: () => import('./features/owner-intro/auth/register/register.component').then(m => m.RegisterComponent),
        data: { showBackButton: false, welcomeText: false }
      }
      // Aquí añadiremos más adelante:
      // { path: 'options', loadComponent: () => ... }
      // { path: 'new-local', loadComponent: () => ... }
    ]
  }
];
