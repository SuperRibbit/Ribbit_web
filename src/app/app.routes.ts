import { Routes } from '@angular/router';
import { Login } from './features/login/login';
import { LandingPage } from './features/landing-page/landing-page';

export const routes: Routes = [
   { path: '', component: LandingPage },
   { path: '**', redirectTo: '' },
   { path: '/login', component: Login }
];
