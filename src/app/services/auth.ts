import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { Observable, switchMap, tap } from 'rxjs';
import { LoginResponse, User } from '../models/user';

@Injectable({
  providedIn: 'root',
})
export class Auth {
  private readonly apiUrl = 'https://ribbit-api-kf5q.onrender.com/ribbit';

  private http = inject(HttpClient)

  avatarUrl = signal<string>('assets/GenericAvatar.png');
  isAdmin = signal<boolean>(false);

  login(credentials: { email: string, password: string }): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/auth/login`, credentials)
      .pipe(
        tap(response => {
          localStorage.setItem('token', response.token);
          const user = (response.user as any) || {};
          const userData = {
            id: user.user_uuid,
            name: user.full_name,
            ...user
          };
          localStorage.setItem('user_data', JSON.stringify(userData));
          if (user && user.avatar_url) {
            this.avatarUrl.set(user.avatar_url);
          }
          this.syncAdminFromStorage();
        })
      );
  }

  register(userData: User): Observable<LoginResponse> {
    return this.http.post<{ message: string, user: User }>(`${this.apiUrl}/users`, userData)
      .pipe(
        switchMap(() => {
          if (!userData.password) {
            throw new Error("Senha necessária para auto-login");
          }
          return this.login({
            email: userData.email,
            password: userData.password
          });
        })
      );
  }

  getToken(): string | null {
    if (typeof localStorage !== 'undefined') {
      return localStorage.getItem('token')
    }
    return null
  }

  getUserIdFromStorage(): string | null {
    const userData = this.getUserData();
    return userData ? userData.id : null;
  }

  getUserData(): any | null {
    if (typeof localStorage !== 'undefined') {
      const userDataStr = localStorage.getItem('user_data');
      if (userDataStr) {
        try {
          return JSON.parse(userDataStr);
        } catch (e) {
          return null;
        }
      }
    }
    return null;
  }

  isLoggedIn(): boolean {
    const token = this.getToken()
    return !!token
  }

  logout(): void {
    if (typeof localStorage !== 'undefined') {
      localStorage.removeItem('token');
      localStorage.removeItem('user_data');
    }
    this.avatarUrl.set('assets/GenericAvatar.png');
    this.isAdmin.set(false);
  }

  syncAdminFromStorage(): void {
    const userData = this.getUserData();
    this.isAdmin.set(!!(userData && userData.role === 'admin'));
  }

  setAvatar(url: string): void {
    this.avatarUrl.set(url || 'assets/GenericAvatar.png');
  }

  forgotPassword(email: string): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(`${this.apiUrl}/auth/forgot-password`, {
      email 
    });
  }

  resetPassword(token: string, newPassword: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/auth/reset-password`, {
      token,
      new_password: newPassword
    });
  }
  
}
