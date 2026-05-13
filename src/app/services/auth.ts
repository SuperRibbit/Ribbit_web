import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable, switchMap, tap } from 'rxjs';
import { LoginResponse, User } from '../models/user';

@Injectable({
  providedIn: 'root',
})
export class Auth {
  private readonly apiUrl = 'https://ribbit-api.onrender.com/ribbit'

  private http = inject(HttpClient)

  login(credentials: { email: string, password: string }): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/auth/login`, credentials)
      .pipe(
        tap(response => {
          localStorage.setItem('token', response.token);
          // Temporário até o getme endpoint estar funcionando
          const userData = {
            id: (response.user as any).user_uuid,
            name: response.user.full_name
          };
          localStorage.setItem('user_data', JSON.stringify(userData));
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
  }

  forgotPassword(email: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/forgot-password`, {
      email
    });
  }
  
}
