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
  CourseClassDetail,
  CoursesResult,
  CourseDetailResponse,
  CourseOperationResponse,
  MessageResponse,
  FileUploadResponse
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

  updateCourse(courseId: number, courseData: CoursePayload): Observable<CourseOperationResponse> {
    const { title, description, slug } = courseData;
    return this.http.put<CourseOperationResponse>(
      `${this.apiUrl}/courses/${courseId}`,
      { title, description, slug }
    );
  }

  getCourses(search?: string): Observable<CoursesResult> {
    const params = search ? new HttpParams().set('search', search) : undefined;
    return this.http.get<CoursesResult>(`${this.apiUrl}/courses`, { params });
  }

  getCourseById(courseId: number): Observable<CourseDetailResponse> {
    return this.http.get<CourseDetailResponse>(`${this.apiUrl}/courses/${courseId}`);
  }

  getCoursesByUser(userId: string): Observable<CoursesResult> {
    return this.http.get<CoursesResult>(`${this.apiUrl}/courses/user/${userId}`);
  }

  deleteCourse(courseId: number): Observable<MessageResponse> {
    return this.http.delete<MessageResponse>(`${this.apiUrl}/courses/${courseId}`);
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

  deleteModule(moduleId: number): Observable<MessageResponse> {
    return this.http.delete<MessageResponse>(`${this.apiUrl}/modules/${moduleId}`);
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

  deleteClass(classId: number): Observable<MessageResponse> {
    return this.http.delete<MessageResponse>(`${this.apiUrl}/classes/${classId}`);
  }

  uploadClassFile(classId: number, file: File): Observable<FileUploadResponse> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('class_id', classId.toString());
    formData.append('display_name', file.name);

    return this.http.post<FileUploadResponse>(`${this.apiUrl}/files/pdf`, formData);
  }

  deleteClassFile(fileId: number): Observable<MessageResponse> {
    return this.http.delete<MessageResponse>(`${this.apiUrl}/files/${fileId}`);
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