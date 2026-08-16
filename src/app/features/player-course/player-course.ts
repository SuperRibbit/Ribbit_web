import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DomSanitizer, SafeHtml, SafeResourceUrl } from '@angular/platform-browser';
import { Modules } from '../../shared/components/modules/modules';
import { CourseService } from '../../services/course_service';
import { CourseClassDetail, CourseFull } from '../../models/course';
import { toDrivePreviewUrl } from '../../utilities/drive_img_extract';

@Component({
  selector: 'app-player-course',
  imports: [Modules],
  templateUrl: './player-course.html',
  styleUrl: './player-course.css',
})
export class PlayerCourse implements OnInit {
  private route = inject(ActivatedRoute);
  private courseService = inject(CourseService);
  private sanitizer = inject(DomSanitizer);

  curso = signal<CourseFull | null>(null);
  activeClassId = signal<number | null>(null);
  activeClass = signal<CourseClassDetail | null>(null);

  isLoadingCourse = signal<boolean>(false);
  isLoadingClass = signal<boolean>(false);
  isTogglingCompletion = signal<boolean>(false);
  errorMessage = signal<string | null>(null);

  currentPdfMaterial = computed(() =>
    this.activeClass()?.materials?.find(m => m.file_type === 'application/pdf') ?? null
  );

  pdfPreviewUrl = computed<SafeResourceUrl | null>(() => {
    const url = this.currentPdfMaterial()?.file_url;
    const previewUrl = toDrivePreviewUrl(url);
    return previewUrl ? this.sanitizer.bypassSecurityTrustResourceUrl(previewUrl) : null;
  });

  sanitizedDescription = computed<SafeHtml>(() =>
    this.sanitizer.bypassSecurityTrustHtml(this.activeClass()?.description ?? '')
  );

  ngOnInit(): void {
    const courseId = this.route.snapshot.paramMap.get('id');
    if (courseId) {
      this.loadCourseStructure(Number(courseId));
    }
  }

  private loadCourseStructure(courseId: number): void {
    this.isLoadingCourse.set(true);
    this.errorMessage.set(null);

    this.courseService.getCourseById(courseId).subscribe({
      next: (course: CourseFull) => {
        this.curso.set(course);
        this.isLoadingCourse.set(false);

        const primeiraAula = course.modules?.find(m => m.classes.length > 0)?.classes[0];
        if (primeiraAula) {
          this.selecionarAula(primeiraAula);
        }
      },
      error: () => {
        this.isLoadingCourse.set(false);
        this.errorMessage.set('Não foi possível carregar o curso.');
      }
    });
  }

  selecionarAula(aula: any): void {
    if (!aula?.class_id || aula.class_id === this.activeClassId()) {
      return;
    }

    this.activeClassId.set(aula.class_id);
    this.isLoadingClass.set(true);
    this.errorMessage.set(null);

    this.courseService.getClassById(aula.class_id).subscribe({
      next: (detail: CourseClassDetail) => {
        this.activeClass.set(detail);
        this.isLoadingClass.set(false);
      },
      error: () => {
        this.isLoadingClass.set(false);
        this.errorMessage.set('Não foi possível carregar a aula.');
      }
    });
  }

  private isCurrentClassCompleted(): boolean {
    const classId = this.activeClassId();
    if (!classId) return false;

    for (const modulo of this.curso()?.modules ?? []) {
      const aula = modulo.classes.find(c => c.class_id === classId);
      if (aula) return !!aula.is_completed;
    }
    return false;
  }

  get isCurrentClassCompletedPublic(): boolean {
    return this.isCurrentClassCompleted();
  }

  toggleCompletion(): void {
    const classId = this.activeClassId();
    if (!classId || this.isTogglingCompletion()) return;

    const jaConcluida = this.isCurrentClassCompleted();
    this.isTogglingCompletion.set(true);

    const request = jaConcluida
      ? this.courseService.removeClassCompletion(classId)
      : this.courseService.completeClass(classId);

    request.subscribe({
      next: () => {
        this.isTogglingCompletion.set(false);
        this.markClassCompletionLocally(classId, !jaConcluida);
      },
      error: () => {
        this.isTogglingCompletion.set(false);
        this.errorMessage.set('Não foi possível atualizar o progresso da aula.');
      }
    });
  }

  private markClassCompletionLocally(classId: number, completed: boolean): void {
    const curso = this.curso();
    if (!curso) return;

    this.curso.set({
      ...curso,
      modules: curso.modules.map(modulo => ({
        ...modulo,
        classes: modulo.classes.map(aula =>
          aula.class_id === classId ? { ...aula, is_completed: completed } : aula
        )
      }))
    });
  }
}