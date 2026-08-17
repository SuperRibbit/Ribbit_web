import { Component, Input, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { DriveImgPipe } from '../../../utilities/pipes/drive-img-pipe';

@Component({
  selector: 'app-card-curso-home',
  standalone: true,
  imports: [CommonModule, DriveImgPipe],
  templateUrl: './card-curso-home.html',
  styleUrl: './card-curso-home.css',
})
export class CardCursoHome {
  private router = inject(Router);
  
  @Input() curso: any;
  @Input() isTeacher = false;

  goToCourse(): void {
    const courseId =
      this.curso?.course_id ??
      this.curso?.id_course;

    if (!courseId) {
      return;
    }

    if (this.isTeacher) {
      this.router.navigate(['/courses', courseId, 'edit']);
      return;
    }

    this.router.navigate(['/courses', courseId]);
  }
}