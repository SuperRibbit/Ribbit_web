import { Component, inject } from '@angular/core';
import { CardCursoHome } from "../../shared/components/card-curso-home/card-curso-home";
import { CardCursoDashboard } from "../../shared/components/card-curso-dashboard/card-curso-dashboard";
import { Footer } from "../../core/footer/footer";
import { CourseService } from '../../services/course.service';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';

@Component({
  selector: 'app-home',
  imports: [CardCursoHome, CardCursoDashboard, Footer],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {
  private courseService = inject(CourseService);
  
  public listaCursos = toSignal(
    this.courseService.getCourses().pipe(
      map((response: { courses: any; }) => response?.courses || [])
    ),
    { initialValue: [] }
  );
}
