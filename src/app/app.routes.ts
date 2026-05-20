import { Routes } from '@angular/router';
import { HomePageComponent } from './pages/home/home-page.component';
import { LoginPageComponent } from './pages/login/login-page.component';
import { RegisterPageComponent } from './pages/register/register-page.component';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'login' },
  { path: 'login', component: LoginPageComponent },
  { path: 'register', component: RegisterPageComponent },
  { path: 'home', component: HomePageComponent },
 // NUEVA RUTA INTEGRADA PARA LIBROS
  { 
    path: 'libros', 
    loadComponent: () => import('./pages/libro-page/libro-page').then(m => m.LibroPage)
  },
  
  // 
  { path: '**', redirectTo: 'login' }
];
