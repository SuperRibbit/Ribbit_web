import { Component, inject, OnInit, signal } from '@angular/core';
import { Modules } from "../../shared/components/modules/modules";
import { ActivatedRoute, Router } from '@angular/router';
import { CourseService } from '../../services/course_service';
import { DriveImgPipe } from '../../utilities/pipes/drive-img-pipe';
import { CustomButton } from "../../shared/components/custom-button/custom-button";
import { EnrollmentsService } from '../../services/enrollments_service';

@Component({
  selector: 'app-course',
  imports: [Modules, DriveImgPipe, CustomButton],
  templateUrl: './course.html',
  styleUrl: './course.css',
})
export class Course implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private courseService = inject(CourseService);
  private enrollmentsService = inject(EnrollmentsService);

  public curso = signal<any>(null);

  ngOnInit(): void {
    const courseId = this.route.snapshot.paramMap.get('id');

    if (courseId) {
      this.loadCourseDetails(Number(courseId));
    }
  }

  private loadCourseDetails(id: number): void {
    this.courseService.getCourseById(id).subscribe({
      next: (response) => {
        const dadosCurso = response.course
          ? response.course
          : response;

        this.curso.set(dadosCurso);
      },
      error: (err) => {
        console.error(
          'Erro ao buscar os detalhes do curso:',
          err
        );
      }
    });
  }

  startCourse(): void {
    const courseId = this.curso()?.id_course;

    if (!courseId) {
      return;
    }

    this.openPlayer(courseId);
  }

  abrirAula(aula: any): void {
    const courseId = this.curso()?.id_course;

    if (!courseId || !aula?.class_id) {
      return;
    }

    this.openPlayer(courseId, aula.class_id);
  }

  private openPlayer(
    courseId: number,
    classId?: number
  ): void {

    const navigateToPlayer = (): void => {
      if (classId) {
        this.router.navigate(['/player', courseId], {
          queryParams: {
            classId: classId
          }
        });

        return;
      }

      this.router.navigate(['/player', courseId]);
    };

    this.enrollmentsService.ensureEnrollment(courseId).subscribe({
      next: (success) => {
        if (success) {
          navigateToPlayer();
        } else {
          console.error(
            'Não foi possível realizar a matrícula no curso.'
          );
        }
      },
      error: (error) => {
        console.error(
          'Erro ao verificar matrícula:',
          error
        );
      }
    });
  }
}