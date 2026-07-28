import { Component, Input, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-card-curso-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './card-curso-home.html',
  styleUrl: './card-curso-home.css',
})
export class CardCursoHome {
  private router = inject(Router);

  @Input() curso: any;

  goToCourse(): void {
    const courseId = this.curso?.course_id ?? this.curso?.id_course;
    if (courseId) {
      this.router.navigate(['/courses', courseId]);
    }
  }
}