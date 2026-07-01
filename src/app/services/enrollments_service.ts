import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Auth } from './auth';

@Injectable({
    providedIn: 'root',
})
export class EnrollmentsService {
    private readonly enrollmentsUrl = 'https://ribbit-api-kf5q.onrender.com/ribbit/enrollments';
    private http = inject(HttpClient);
    private authService = inject(Auth);

    private getHeaders(): HttpHeaders {
        const token = this.authService.getToken();
        return new HttpHeaders()
        .set('Authorization', `Bearer ${token}`)
        .set('Content-Type', 'application/json');
    }

    getMyCourses(): Observable<any> {
        const headers = this.getHeaders();
        return this.http.get<any>(`${this.enrollmentsUrl}/my-courses`, { headers });
    }
}