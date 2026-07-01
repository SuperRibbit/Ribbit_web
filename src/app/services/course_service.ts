import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ClassPayload, CoursePayload, ModulePayload } from '../models/course';
import { Auth } from './auth';

@Injectable({ providedIn: 'root' })
export class CourseService {
  private http = inject(HttpClient);
  private authService = inject(Auth);
  private readonly apiUrl = 'https://ribbit-api-kf5q.onrender.com/ribbit';

  private getHeaders(isFormData = false): HttpHeaders {
    const token = this.authService.getToken();
    let headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    
    if (!isFormData) {
      headers = headers.set('Content-Type', 'application/json');
    }
    
    return headers;
  }

  createCourse(courseData: CoursePayload, bannerFile?: File): Observable<{ message: string, course_id: number }> {
    const formData = new FormData();
    formData.append('title', courseData.title);
    formData.append('slug', courseData.slug);
    formData.append('description', courseData.description);
    
    if (bannerFile) {
      formData.append('banner', bannerFile);
    }

    return this.http.post<{ message: string, course_id: number }>(`${this.apiUrl}/courses`, formData, {
      headers: this.getHeaders(true)
    });
  }

  createModule(moduleData: ModulePayload): Observable<any> {
    return this.http.post(`${this.apiUrl}/modules`, moduleData, {
      headers: this.getHeaders(false)
    });
  }

  createClass(classData: ClassPayload): Observable<any> {
    return this.http.post(`${this.apiUrl}/classes`, classData, {
      headers: this.getHeaders(false)
    });
  }

  uploadClassFile(classId: number, file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('class_id', classId.toString());
    formData.append('display_name', file.name);
    
    return this.http.post(`${this.apiUrl}/files/pdf`, formData, {
      headers: this.getHeaders(true)
    });
  }
}