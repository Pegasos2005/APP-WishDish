import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [

  {
    path: 'owner-intro/login',
    loadComponent: () => import('./features/owner-intro/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'owner-intro/register',
    loadComponent: () => import('./features/owner-intro/register/register.component').then(m => m.RegisterComponent)
  },
  {
    path: 'owner-intro',
    canActivate: [authGuard], // 👮‍♂️ Ponemos el guardián en la puerta principal
    children: [
      // Todas las rutas aquí dentro están protegidas automáticamente
      {
        path: 'dashboard',
        loadComponent: () => import('./features/owner-intro/dashboard/dashboard.component').then(m => m.DashboardComponent)
      }
    ]
  },

  // (Opcional) Ruta por defecto para que no se pierdan
  { path: '', redirectTo: 'owner-intro/login', pathMatch: 'full' },
];
