import { Routes } from '@angular/router';
import { HomePageComponent } from './pages/home/home-page.component';
import { LoginPageComponent } from './pages/login/login-page.component';
import { RegisterPageComponent } from './pages/register/register-page.component';
import { adminGuard } from './guards/admin.guard';

export const routes: Routes = [
  { path: 'login', component: LoginPageComponent, title: 'Iniciar Sesión — Bookify' },
  { path: 'register', component: RegisterPageComponent, title: 'Registrarse — Bookify' },

  // Layout Principal Público (Stripe Press style)
  {
    path: '',
    loadComponent: () => import('./layout/main-layout/main-layout.component').then(m => m.MainLayoutComponent),
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'home' },
      { path: 'home', component: HomePageComponent, title: 'Inicio — Bookify' },
      {
        path: 'explorar',
        title: 'Explorar Catálogo — Bookify',
        loadComponent: () => import('./pages/explorar/explorar-page.component').then(m => m.ExplorarPageComponent)
      },
      {
        path: 'mi-biblioteca',
        title: 'Mi Biblioteca — Bookify',
        loadComponent: () => import('./pages/biblioteca/biblioteca-page.component').then(m => m.BibliotecaPageComponent)
      },
      {
        path: 'libro/:id',
        title: 'Detalles del Libro — Bookify',
        loadComponent: () => import('./pages/detalle-libro/detalle-libro-page.component').then(m => m.DetalleLibroPageComponent)
      },
      {
        path: 'pago/:preferenceId',
        title: 'Pago Seguro — Bookify',
        loadComponent: () => import('./pages/simulador-pago/simulador-pago.component').then(m => m.SimuladorPagoComponent)
      },
      {
        path: 'pago-exitoso',
        title: 'Pago Exitoso — Bookify',
        loadComponent: () => import('./pages/pago/pago-exitoso/pago-exitoso.component').then(m => m.PagoExitosoComponent)
      },
      {
        path: 'pago-pendiente',
        title: 'Pago Pendiente — Bookify',
        loadComponent: () => import('./pages/pago/pago-pendiente/pago-pendiente.component').then(m => m.PagoPendienteComponent)
      },
      {
        path: 'pago-fallido',
        title: 'Pago Rechazado — Bookify',
        loadComponent: () => import('./pages/pago/pago-fallido/pago-fallido.component').then(m => m.PagoFallidoComponent)
      }
    ]
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
