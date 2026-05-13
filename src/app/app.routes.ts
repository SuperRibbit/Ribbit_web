import { Routes } from '@angular/router';
import { Logon } from './features/auth/logon/logon';
import { Login } from './features/auth/login/login';
import { LandingPage } from './features/landing-page/landing-page';
import { Home } from './features/home/home';
import { authGuard } from './guards/auth-guard';
import { Profile } from './features/profile/profile';
import { Course } from './features/course/course';  
import { Mail } from './features/auth/password_reset/mail/mail';
import { Reset } from './features/auth/password_reset/reset/reset';

export const routes: Routes = [
  { path: '', component: LandingPage },
  { path: 'login', component: Login, data: { hideNavbar: true }},
  { path: 'logon', component: Logon, data: { hideNavbar: true } },
  { path: 'forgot-password', component: Mail, data: { hideNavbar: true }},
  { path: 'reset-password', component: Reset, data: { hideNavbar: true }},
  { path: 'profile', component: Profile, canActivate: [authGuard] },
  { path: 'home', component: Home, canActivate: [authGuard] },
  { path: 'course', component: Course, canActivate: [authGuard] },
  { path: '**', redirectTo: '' } 
];
