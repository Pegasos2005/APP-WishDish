import { Routes } from '@angular/router';

export const routes: Routes = [
  // 1. Cuando el usuario entra a la raíz (localhost:4200), lo redirigimos al login
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },

  // 2. Ruta de Login con "Lazy Loading" (apuntando a tu nueva estructura)
  {
    path: 'login',
    loadComponent: () => import('./features/owner-intro/auth/login/login.component').then(m => m.LoginComponent)
  },

  // 3. Ruta a la que va después de loguearse (La crearemos más adelante, por ahora la dejamos vacía o apuntando a un componente futuro)
  // {
  //   path: 'owner-intro',
  //   loadComponent: () => import('./features/owner-intro/intro-options.component').then(m => m.IntroOptionsComponent)
  // }
];
