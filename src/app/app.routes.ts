import { Routes } from '@angular/router';
import { HomePageComponent } from './pages/home/home-page.component';
import { RegisterPageComponent } from './pages/register/register-page.component';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'register' },
  { path: 'register', component: RegisterPageComponent },
  { path: 'home', component: HomePageComponent },
  { path: '**', redirectTo: 'register' }
];
