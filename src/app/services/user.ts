import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable, of, tap } from 'rxjs';
import { environment } from '../../environments/environment';
import { Auth } from './auth';

@Injectable({
  providedIn: 'root',
})
export class User {
  private readonly apiUrl = environment.apiUrl;
  private http = inject(HttpClient);
  private authService = inject(Auth);

  private profileCache: { userId: string | null; data: any } | null = null;

  updateProfile(data: { full_name?: string; email?: string; password?: string; avatar_url?: string }): Observable<any> {
    return this.http.put(`${this.apiUrl}/users/me`, data).pipe(
      tap((response: any) => {
        this.updateProfileCache(response);

        const user = response?.user ? response.user : response;
        if (user && user.avatar_url) {
          this.authService.setAvatar(user.avatar_url);
        }
      })
    );
  }

  getProfile(): Observable<any> {
    const userId = this.authService.getUserIdFromStorage();

    if (this.profileCache && this.profileCache.userId === userId) {
      return of(this.profileCache.data);
    }

    return this.http.get(`${this.apiUrl}/users/me`).pipe(
      tap((response: any) => {
        this.profileCache = { userId, data: response };

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

  private updateProfileCache(response: any): void {
    const userId = this.authService.getUserIdFromStorage();
    this.profileCache = { userId, data: response };
  }

  updateUserRole(userUuid: string, role: string) {
    return this.http.patch(`${this.apiUrl}/users/${userUuid}/role`, { role });
  }
}
