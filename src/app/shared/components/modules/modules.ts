import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-modules',
  imports: [CommonModule],
  templateUrl: './modules.html',
  styleUrl: './modules.css',
})
export class Modules {
  @Input() modules: any;
  @Input() courseId?: number | string;
  @Input() activeClassId: number | null = null;
  @Output() classSelected = new EventEmitter<any>();

  public estaExpandido: boolean = false;
  private router = inject(Router);

  toggleModulo() {
    this.estaExpandido = !this.estaExpandido;
  }

  selecionarAula(aula: any): void {
    this.classSelected.emit(aula);

    const targetId = this.courseId || aula.course_id || aula.class_id;

    this.router.navigate(['/player', targetId], {
      queryParams: { classId: aula.class_id }
    });
  }
}