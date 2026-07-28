import { Routes } from '@angular/router';
import { Logon } from './features/auth/logon/logon';
import { Login } from './features/auth/login/login';
import { LandingPage } from './features/landing-page/landing-page';
import { Home } from './features/home/home';
import { authGuard } from './guards/auth-guard';
import { Profile } from './features/profile/profile';
import { Course } from './features/course/course';  
import { PlayerCourse } from './features/player-course/player-course';
import { Mail } from './features/auth/password_reset/mail/mail';
import { Reset } from './features/auth/password_reset/reset/reset';
import { CourseForm } from './features/course/course-form/course-form';
import { roleGuard } from './guards/role-guard';

export const routes: Routes = [
  { path: '', component: LandingPage, data: { publicRoute: true } },
  { path: 'login', component: Login, data: { hideNavbar: true }},
  { path: 'logon', component: Logon, data: { hideNavbar: true } },
  { path: 'forgot-password', component: Mail, data: { hideNavbar: true }},
  { path: 'reset-password', component: Reset, data: { hideNavbar: true }},
  { path: 'profile', component: Profile, canActivate: [authGuard] },
  { path: 'home', component: Home, canActivate: [authGuard] },
  { path: 'courses/new', component: CourseForm, canActivate: [authGuard, roleGuard] },
  { path: 'courses/:id/edit', component: CourseForm, canActivate: [authGuard, roleGuard] },
  { path: 'courses/:id', component: Course, canActivate: [authGuard] },
  { path: 'player-course', component: PlayerCourse, canActivate: [authGuard] },
  { path: '**', redirectTo: '' } 
];
