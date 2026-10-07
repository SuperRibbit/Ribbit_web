import { Component, OnInit, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Subject, Subscription, debounceTime } from 'rxjs';
import { CourseFull } from '../../../models/course';
import { CourseService } from '../../../services/course_service';

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

  searchTerm = signal('');
  private search$ = new Subject<void>();
  private request?: Subscription;

  courses = signal<CourseFull[]>([]);
  isLoading = signal(true);
  errorMessage = signal('');

  showDeleteModal = signal(false);
  selectedCourse = signal<CourseFull | null>(null);
  isDeleting = signal(false);

  constructor() {
    this.search$
      .pipe(debounceTime(300), takeUntilDestroyed())
      .subscribe(() => this.fetchCourses());
  }

  ngOnInit(): void {
    this.fetchCourses();
  }

  onSearchChange(term: string): void {
    this.searchTerm.set(term);
    this.search$.next();
  }

  fetchCourses(): void {
    this.isLoading.set(true);
    this.errorMessage.set('');

    this.request?.unsubscribe();
    this.request = this.courseService.getCourses(this.searchTerm().trim() || undefined).subscribe({
      next: (response) => {
        const rawCourses = response?.courses || (Array.isArray(response) ? response : []);

        this.courses.set(rawCourses.map((c: any) => ({
          ...c,
          id_course: c.id_course ?? c.id,
          modules: c.modules || []
        })));

        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Erro ao buscar cursos:', err);
        this.errorMessage.set('Não foi possível carregar os cursos.');
        this.isLoading.set(false);
      }
    });
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
    this.selectedCourse.set(course);
    this.showDeleteModal.set(true);
  }

  closeDeleteModal(): void {
    if (this.isDeleting()) return;
    this.showDeleteModal.set(false);
    this.selectedCourse.set(null);
  }

  confirmDeleteCourse(): void {
    const courseId = this.selectedCourse()?.id_course;

    if (courseId == null) return;

    this.isDeleting.set(true);

    this.courseService.deleteCourse(courseId).subscribe({
      next: () => {
        this.courses.update(courses => courses.filter(c => c.id_course !== courseId));
        this.isDeleting.set(false);
        this.closeDeleteModal();
      },
      error: (err) => {
        console.error('Erro ao excluir curso:', err);
        alert('Não foi possível excluir o curso. Tente novamente.');
        this.isDeleting.set(false);
      }
    });
  }
}
