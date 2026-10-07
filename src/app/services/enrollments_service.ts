import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable, catchError, of, switchMap } from 'rxjs';
import { environment } from '../../environments/environment';

export interface EnrollmentStatus {
  is_enrolled: boolean;
  progress: number;
  enrollment_date: string | null;
}

@Injectable({
  providedIn: 'root',
})
export class EnrollmentsService {
  private readonly enrollmentsUrl = `${environment.apiUrl}/enrollments`;

  private http = inject(HttpClient);

  enroll(courseId: number): Observable<{ message: string; enrollment_id: number }> {
    return this.http.post<{ message: string; enrollment_id: number }>(
      this.enrollmentsUrl,
      { course_id: courseId }
    );
  }

  getEnrollmentStatus(courseId: number): Observable<EnrollmentStatus> {
    return this.http.get<EnrollmentStatus>(
      `${this.enrollmentsUrl}/status/course/${courseId}`
    );
  }

  getMyCourses(): Observable<any> {
    return this.http.get<any>(`${this.enrollmentsUrl}/my-courses`);
  }

  unenroll(courseId: number): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(
      `${this.enrollmentsUrl}/course/${courseId}`
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