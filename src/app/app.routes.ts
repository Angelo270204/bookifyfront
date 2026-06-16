import { Routes } from '@angular/router';
import { HomePageComponent } from './pages/home/home-page.component';
import { LoginPageComponent } from './pages/login/login-page.component';
import { RegisterPageComponent } from './pages/register/register-page.component';
import { adminGuard } from './guards/admin.guard';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'home' },
  { path: 'login', component: LoginPageComponent, title: 'Iniciar Sesión — Bookify' },
  { path: 'register', component: RegisterPageComponent, title: 'Registrarse — Bookify' },
  { path: 'home', component: HomePageComponent, title: 'Inicio — Bookify' },
  {
    path: 'explorar',
    title: 'Explorar Catálogo — Bookify',
    loadComponent: () => import('./pages/explorar/explorar-page.component').then(m => m.ExplorarPageComponent)
  },
  {
    path: 'libro/:id',
    title: 'Detalles del Libro — Bookify',
    loadComponent: () => import('./pages/detalle-libro/detalle-libro-page.component').then(m => m.DetalleLibroPageComponent)
  },

  // Panel de administración con layout anidado
  {
    path: 'admin',
    title: 'Panel de Administración — Bookify',
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
