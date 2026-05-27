import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Auth } from './auth';
import {
  Course,
  CreateModulePayload,
  CreateClassPayload,
  CreateCourseResponse,
  CreateModuleResponse
} from '../models/course';

@Injectable({ providedIn: 'root' })
export class CourseService {
  private readonly apiUrl = 'https://ribbit-api-kf5q.onrender.com/ribbit';
  private http = inject(HttpClient);
  private authService = inject(Auth);

  private getHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    return new HttpHeaders({ Authorization: `Bearer ${token}` });
  }

  createCourse(course: Course): Observable<CreateCourseResponse> {
    return this.http.post<CreateCourseResponse>(
      `${this.apiUrl}/courses`,
      course,
      { headers: this.getHeaders() }
    );
  }

  createModule(module: CreateModulePayload): Observable<CreateModuleResponse> {
    return this.http.post<CreateModuleResponse>(
      `${this.apiUrl}/modules`,
      module,
      { headers: this.getHeaders() }
    );
  }

  createClass(classItem: CreateClassPayload): Observable<any> {
    return this.http.post(
      `${this.apiUrl}/classes`,
      classItem,
      { headers: this.getHeaders() }
    );
  }
}