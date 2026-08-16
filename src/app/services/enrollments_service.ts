import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable, catchError, of, switchMap } from 'rxjs';
import { Auth } from './auth';

export interface EnrollmentStatus {
  is_enrolled: boolean;
  progress: number;
  enrollment_date: string | null;
}

@Injectable({
  providedIn: 'root',
})
export class EnrollmentsService {
  private readonly enrollmentsUrl =
    'https://ribbit-api-kf5q.onrender.com/ribbit/enrollments';

  private http = inject(HttpClient);
  private authService = inject(Auth);

  private getHeaders(): HttpHeaders {
    const token = this.authService.getToken();

    return new HttpHeaders()
      .set('Authorization', `Bearer ${token}`)
      .set('Content-Type', 'application/json');
  }

  enroll(courseId: number): Observable<{ message: string; enrollment_id: number }> {
    return this.http.post<{ message: string; enrollment_id: number }>(
      this.enrollmentsUrl,
      { course_id: courseId },
      { headers: this.getHeaders() }
    );
  }

  getEnrollmentStatus(courseId: number): Observable<EnrollmentStatus> {
    return this.http.get<EnrollmentStatus>(
      `${this.enrollmentsUrl}/status/course/${courseId}`,
      { headers: this.getHeaders() }
    );
  }

  getMyCourses(): Observable<any> {
    return this.http.get<any>(
      `${this.enrollmentsUrl}/my-courses`,
      { headers: this.getHeaders() }
    );
  }

  ensureEnrollment(courseId: number): Observable<boolean> {
    return this.getEnrollmentStatus(courseId).pipe(
      switchMap(status => {
        if (status.is_enrolled) {
          return of(true);
        }

        return this.enroll(courseId).pipe(
          switchMap(() => of(true))
        );
      }),
      catchError(error => {
        console.error('Erro ao concluir matrícula:', error);
        return of(false);
      })
    );
  }
}