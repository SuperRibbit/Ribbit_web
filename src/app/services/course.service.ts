import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Auth } from './auth';

@Injectable({
  providedIn: 'root',
})
export class CourseService {
  private readonly apiUrl = 'https://ribbit-api-kf5q.onrender.com/ribbit/courses';
  private http = inject(HttpClient);
  private authService = inject(Auth);

  private getHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    return new HttpHeaders()
      .set('Authorization', `Bearer ${token}`)
      .set('Content-Type', 'application/json');
  }

  getCourses(search?: string): Observable<any> {
    const headers = this.getHeaders();
    const url = search ? `${this.apiUrl}?search=${search}` : this.apiUrl;
    return this.http.get<any>(url, { headers });
  }

  getCourseById(courseId: number): Observable<any> {
    const headers = this.getHeaders();
    return this.http.get<any>(`${this.apiUrl}/${courseId}`, { headers });
  }
}