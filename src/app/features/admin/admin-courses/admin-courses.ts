import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core'; 
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CourseFull } from '../../../models/course';
import { CourseService } from '../../../services/course_service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-admin-courses',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './admin-courses.html',
  styleUrls: ['./admin-courses.css']
})
export class AdminCourses implements OnInit {
  private router = inject(Router);
  private courseService = inject(CourseService);
  private cdr = inject(ChangeDetectorRef);
  private http = inject(HttpClient);

  searchTerm = '';
  courses: CourseFull[] = [];
  isLoading = true;
  errorMessage = '';

  showDeleteModal = false;
  selectedCourse: CourseFull | null = null;
  isDeleting = false;

  ngOnInit(): void {
    this.fetchCourses();
  }

  fetchCourses(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.courseService.getCourses().subscribe({
      next: (response) => {
        const rawCourses = response?.courses || (Array.isArray(response) ? response : []);

        this.courses = rawCourses.map((c: any) => ({
          ...c,
          id_course: c.id_course ?? c.id,
          modules: c.modules || []
        }));

        this.isLoading = false;
        this.cdr.detectChanges(); 
      },
      error: (err) => {
        console.error('Erro ao buscar cursos:', err);
        this.errorMessage = 'Não foi possível carregar os cursos.';
        this.isLoading = false;
        this.cdr.detectChanges(); 
      }
    });
  }

  get filteredCourses(): CourseFull[] {
    if (!this.searchTerm || !this.searchTerm.trim()) {
      return this.courses;
    }
    const term = this.searchTerm.trim().toLowerCase();
    return this.courses.filter(course =>
      (course.title && course.title.toLowerCase().includes(term)) ||
      (course.teacher_name && course.teacher_name.toLowerCase().includes(term)) ||
      (course.slug && course.slug.toLowerCase().includes(term))
    );
  }

  onViewCourse(courseId: number): void {
    this.router.navigate(['/courses', courseId]);
  }

  onEditCourse(courseId: number): void {
    this.router.navigate(['/courses', courseId, 'edit']);
  }

  onCreateCourse(): void {
    this.router.navigate(['/courses/new']);
  }

  openDeleteModal(course: CourseFull): void {
    this.selectedCourse = course;
    this.showDeleteModal = true;
  }

  closeDeleteModal(): void {
    if (this.isDeleting) return;
    this.showDeleteModal = false;
    this.selectedCourse = null;
  }

  confirmDeleteCourse(): void {
    if (!this.selectedCourse) return;

    this.isDeleting = true;
    const courseId = this.selectedCourse.id_course;

    this.courseService.deleteCourse(courseId).subscribe({
      next: () => {
        this.courses = this.courses.filter(c => c.id_course !== courseId);
        this.isDeleting = false;
        this.closeDeleteModal();
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Erro ao excluir curso:', err);
        alert('Não foi possível excluir o curso. Tente novamente.');
        this.isDeleting = false;
        this.cdr.detectChanges();
      }
    });
  }
}