import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { Auth } from './auth';

@Injectable({
  providedIn: 'root',
})
export class User {
  private readonly apiUrl = 'https://ribbit-api-kf5q.onrender.com/ribbit';
  private http = inject(HttpClient);
  private authService = inject(Auth);

  updateProfile(data: { full_name?: string; email?: string; password?: string; avatar_url?: string }): Observable<any> {
    const userId = this.authService.getUserIdFromStorage();
    const token = this.authService.getToken();
    const headers = new HttpHeaders()
      .set('Authorization', `Bearer ${token}`)
      .set('Content-Type', 'application/json');

    return this.http.put(`${this.apiUrl}/users/me`, data, { headers }).pipe(
      tap((response: any) => {
        const user = response?.user ? response.user : response;
        if (user && user.avatar_url) {
          this.authService.setAvatar(user.avatar_url);
        }
      })
    );
  }

  getProfile() {
    const token = this.authService.getToken();
    const headers = new HttpHeaders()
      .set('Authorization', `Bearer ${token}`)
      .set('Content-Type', 'application/json');

    return this.http.get(`${this.apiUrl}/users/me`, { headers }).pipe(
      tap((response: any) => {
        const user = response?.user ? response.user : response;
        if (user && user.avatar_url) {
          this.authService.setAvatar(user.avatar_url);
        }
      })
    );
  }

  getUsers() {
    const token = this.authService.getToken();
    const headers = new HttpHeaders()
      .set('Authorization', `Bearer ${token}`)
      .set('Content-Type', 'application/json');

    return this.http.get(`${this.apiUrl}/users`, { headers });
  }
}
