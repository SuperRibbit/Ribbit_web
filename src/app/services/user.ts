import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Auth } from './auth';

@Injectable({
  providedIn: 'root',
})
export class User {
  private readonly apiUrl = 'https://ribbit-api.onrender.com/ribbit';
  private http = inject(HttpClient);
  private authService = inject(Auth);

  updateProfile(data: { full_name?: string; email?: string; password?: string; avatar_url?: string }): Observable<any> {
    const userId = this.authService.getUserIdFromStorage();
    const token = this.authService.getToken();
    const headers = new HttpHeaders()
      .set('Authorization', `Bearer ${token}`)
      .set('Content-Type', 'application/json');

    return this.http.put(`${this.apiUrl}/users/${userId}`, data, { headers });
  }

  getProfile() {
    const token = this.authService.getToken();
    const headers = new HttpHeaders()
      .set('Authorization', `Bearer ${token}`)
      .set('Content-Type', 'application/json');

    return this.http.get(`${this.apiUrl}/users/me`, { headers });
  }
}
