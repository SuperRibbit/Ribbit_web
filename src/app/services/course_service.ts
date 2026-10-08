import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
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
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class CourseService {
  private http = inject(HttpClient);
  private readonly apiUrl = environment.apiUrl;

  createCourse(courseData: CoursePayload, bannerFile?: File): Observable<CreateCourseResponse> {
    const formData = new FormData();
    formData.append('title', courseData.title);
    formData.append('slug', courseData.slug);
    formData.append('description', courseData.description);

    if (bannerFile) {
      formData.append('banner', bannerFile);
    }

    return this.http.post<CreateCourseResponse>(`${this.apiUrl}/courses`, formData);
  }

  updateCourse(courseId: number, courseData: CoursePayload): Observable<any> {
    const { title, description, slug } = courseData;
    return this.http.put(`${this.apiUrl}/courses/${courseId}`, { title, description, slug });
  }

  getCourses(search?: string): Observable<any> {
    const params = search ? new HttpParams().set('search', search) : undefined;
    return this.http.get<any>(`${this.apiUrl}/courses`, { params });
  }

  getCourseById(courseId: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/courses/${courseId}`);
  }

  getCoursesByUser(userId: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/courses/user/${userId}`);
  }

  deleteCourse(courseId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/courses/${courseId}`);
  }

  createModule(moduleData: ModulePayload): Observable<CreateModuleResponse> {
    return this.http.post<CreateModuleResponse>(`${this.apiUrl}/modules`, moduleData);
  }

  updateModule(moduleId: number, moduleData: ModulePayload): Observable<UpdateModuleResponse> {
    return this.http.put<UpdateModuleResponse>(`${this.apiUrl}/modules/${moduleId}`, moduleData);
  }

  getModuleWithClasses(moduleId: number): Observable<ModuleWithClasses> {
    return this.http.get<ModuleWithClasses>(`${this.apiUrl}/modules/${moduleId}/classes`);
  }

  deleteModule(moduleId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/modules/${moduleId}`);
  }

  createClass(classData: ClassPayload): Observable<CreateClassResponse> {
    return this.http.post<CreateClassResponse>(`${this.apiUrl}/classes`, classData);
  }

  updateClass(classId: number, classData: Partial<ClassPayload>): Observable<UpdateClassResponse> {
    return this.http.put<UpdateClassResponse>(`${this.apiUrl}/classes/${classId}`, classData);
  }

  getClassById(classId: number): Observable<CourseClassDetail> {
    return this.http.get<CourseClassDetail>(`${this.apiUrl}/classes/${classId}`);
  }

  deleteClass(classId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/classes/${classId}`);
  }

  uploadClassFile(classId: number, file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('class_id', classId.toString());
    formData.append('display_name', file.name);

    return this.http.post(`${this.apiUrl}/files/pdf`, formData);
  }

  deleteClassFile(fileId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/files/${fileId}`);
  }

  completeClass(classId: number): Observable<{ message: string, new_course_progress: number }> {
    return this.http.post<{ message: string, new_course_progress: number }>(
      `${this.apiUrl}/progress`,
      { classId }
    );
  }

  removeClassCompletion(classId: number): Observable<{ message: string, new_course_progress: number }> {
    return this.http.delete<{ message: string, new_course_progress: number }>(
      `${this.apiUrl}/progress/${classId}`
    );
  }
}