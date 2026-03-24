import { Routes } from '@angular/router';
import { Cadastro } from './features/cadastro/cadastro';
import { Login } from './features/login/login';
import { LandingPage } from './features/landing-page/landing-page';
import { Perfil } from './features/perfil/perfil';

export const routes: Routes = [
  { path: '', component: LandingPage },
  { path: 'login', component: Login },
  { path: 'cadastro', component: Cadastro },
  { path: 'perfil', component: Perfil },
  { path: '**', redirectTo: '' } 
];
