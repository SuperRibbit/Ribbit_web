import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { environment } from '../../environments/environment';
import { Auth } from './auth';

@Injectable({
  providedIn: 'root',
})
export class User {
  private readonly apiUrl = environment.apiUrl;
  private http = inject(HttpClient);
  private authService = inject(Auth);

  updateProfile(data: { full_name?: string; email?: string; password?: string; avatar_url?: string }): Observable<any> {
    return this.http.put(`${this.apiUrl}/users/me`, data).pipe(
      tap((response: any) => {
        const user = response?.user ? response.user : response;
        if (user && user.avatar_url) {
          this.authService.setAvatar(user.avatar_url);
        }
      })
    );
  }

  getProfile() {
    return this.http.get(`${this.apiUrl}/users/me`).pipe(
      tap((response: any) => {
        const user = response?.user ? response.user : response;
        if (user && user.avatar_url) {
          this.authService.setAvatar(user.avatar_url);
        }
      })
    );
  }

  getUsers() {
    return this.http.get(`${this.apiUrl}/users`);
  }
}
