import { Routes } from '@angular/router';
import { HomePageComponent } from './pages/home/home-page.component';
import { LoginPageComponent } from './pages/login/login-page.component';
import { RegisterPageComponent } from './pages/register/register-page.component';
import { adminGuard } from './guards/admin.guard';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'login' },
  { path: 'login', component: LoginPageComponent },
  { path: 'register', component: RegisterPageComponent },
  { path: 'home', component: HomePageComponent },

  // Panel de administración con layout anidado
  {
    path: 'admin',
    canActivate: [adminGuard],
    loadComponent: () => import('./pages/admin/admin-layout.component').then(m => m.AdminLayoutComponent),
    children: [
      { path: '', redirectTo: 'libros', pathMatch: 'full' },
      {
        path: 'libros',
        loadComponent: () => import('./pages/libro-page/libro-page').then(m => m.LibroPage)
      },
      {
        path: 'autores',
        loadComponent: () => import('./pages/admin/autores/autores-page.component').then(m => m.AutoresPageComponent)
      },
      {
        path: 'categorias',
        loadComponent: () => import('./pages/admin/categorias/categorias-page.component').then(m => m.CategoriasPageComponent)
      }
    ]
  },

  { path: '**', redirectTo: 'login' }
];
