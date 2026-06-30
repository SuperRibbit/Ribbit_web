import { Component, inject, OnInit, signal } from '@angular/core';
import { Modules } from "../../shared/components/modules/modules";
import { CourseService } from '../../services/course.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-course',
  imports: [Modules],
  templateUrl: './course.html',
  styleUrl: './course.css',
})
export class Course implements OnInit{
  private route = inject(ActivatedRoute);
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
}
