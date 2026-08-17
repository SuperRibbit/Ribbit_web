import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  ClassPayload,
  CoursePayload,
  ModulePayload,
  CreateCourseResponse,
  CreateModuleResponse,
  CreateClassResponse,
  UpdateModuleResponse,
  UpdateClassResponse,
  CourseFull,
  ModuleWithClasses,
  CourseClassDetail
} from '../models/course';
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

  createCourse(courseData: CoursePayload, bannerFile?: File): Observable<CreateCourseResponse> {
    const formData = new FormData();
    formData.append('title', courseData.title);
    formData.append('slug', courseData.slug);
    formData.append('description', courseData.description);

    if (bannerFile) {
      formData.append('banner', bannerFile);
    }

    return this.http.post<CreateCourseResponse>(`${this.apiUrl}/courses`, formData, {
      headers: this.getHeaders(true)
    });
  }

  updateCourse(courseId: number, courseData: CoursePayload): Observable<any> {
    const { title, description, slug } = courseData;
    return this.http.put(`${this.apiUrl}/courses/${courseId}`, { title, description, slug }, {
      headers: this.getHeaders(false)
    });
  }

  deleteCourse(courseId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/courses/${courseId}`, { headers: this.getHeaders() });
  }

  getCourses(search?: string): Observable<any> {
    const headers = this.getHeaders();
    const url = search ? `${this.apiUrl}/courses?search=${search}` : `${this.apiUrl}/courses`;
    return this.http.get<any>(url, { headers });
  }

  getCourseById(courseId: number): Observable<any> {
    const headers = this.getHeaders();
    return this.http.get<any>(`${this.apiUrl}/courses/${courseId}`, { headers });
  }

  getCoursesByUser(userId: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/courses/user/${userId}`, { headers: this.getHeaders() });
  }

  createModule(moduleData: ModulePayload): Observable<CreateModuleResponse> {
    return this.http.post<CreateModuleResponse>(`${this.apiUrl}/modules`, moduleData, {
      headers: this.getHeaders(false)
    });
  }

  updateModule(moduleId: number, moduleData: ModulePayload): Observable<UpdateModuleResponse> {
    return this.http.put<UpdateModuleResponse>( `${this.apiUrl}/modules/${moduleId}`, moduleData, { headers: this.getHeaders(false) });
  }

  getModuleWithClasses(moduleId: number): Observable<ModuleWithClasses> {
    return this.http.get<ModuleWithClasses>(`${this.apiUrl}/modules/${moduleId}/classes`, {
      headers: this.getHeaders()
    });
  }

  deleteModule(moduleId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/modules/${moduleId}`, {
      headers: this.getHeaders()
    });
  }

  createClass(classData: ClassPayload): Observable<CreateClassResponse> {
    return this.http.post<CreateClassResponse>(`${this.apiUrl}/classes`, classData, {
      headers: this.getHeaders(false)
    });
  }

  updateClass(classId: number, classData: Partial<ClassPayload>): Observable<UpdateClassResponse> {
    return this.http.put<UpdateClassResponse>(`${this.apiUrl}/classes/${classId}`, classData, {
      headers: this.getHeaders(false)
    });
  }

  getClassById(classId: number): Observable<CourseClassDetail> {
    return this.http.get<CourseClassDetail>(`${this.apiUrl}/classes/${classId}`, {
      headers: this.getHeaders()
    });
  }

  deleteClass(classId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/classes/${classId}`, {
      headers: this.getHeaders()
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

  deleteClassFile(fileId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/files/${fileId}`, {
      headers: this.getHeaders()
    });
  }

  completeClass(classId: number): Observable<{ message: string, new_course_progress: number }> {
    return this.http.post<{ message: string, new_course_progress: number }>(
      `${this.apiUrl}/progress`,
      { classId },
      { headers: this.getHeaders(false) }
    );
  }

  removeClassCompletion(classId: number): Observable<{ message: string, new_course_progress: number }> {
    return this.http.delete<{ message: string, new_course_progress: number }>(
      `${this.apiUrl}/progress/${classId}`,
      { headers: this.getHeaders() }
    );
  }
}