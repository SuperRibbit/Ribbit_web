import { Component, inject, OnInit, signal } from '@angular/core';
import { Modules } from "../../shared/components/modules/modules";
import { ActivatedRoute, Router } from '@angular/router';
import { CourseService } from '../../services/course_service';
import { DriveImgPipe } from '../../utilities/pipes/drive-img-pipe';
import { CustomButton } from "../../shared/components/custom-button/custom-button";

@Component({
  selector: 'app-course',
  imports: [Modules, DriveImgPipe, CustomButton],
  templateUrl: './course.html',
  styleUrl: './course.css',
})
export class Course implements OnInit{
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private courseService = inject(CourseService);

  
  public curso = signal<any>(null);

  ngOnInit() {
    const courseId = this.route.snapshot.paramMap.get('id');
    if (courseId) {
      this.loadCourseDetails(Number(courseId));
    }
  }

  private loadCourseDetails(id: number) {
    this.courseService.getCourseById(id).subscribe({
      next: (response) => {
        const dadosCurso = response.course ? response.course : response;
        this.curso.set(dadosCurso);
      },
      error: (err) => {
        console.error('Erro ao buscar os detalhes do curso:', err);
      }
    });
  }

  startCourse(): void {
    const courseId = this.curso()?.id_course;
    if (courseId) {
      this.router.navigate(['/player', courseId]);
    }
  }
}