import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { CourseClass, CourseModule } from '../../../models/course';

@Component({
  selector: 'app-modules',
  imports: [CommonModule],
  templateUrl: './modules.html',
  styleUrl: './modules.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Modules {
  @Input() modules!: CourseModule;
  @Input() activeClassId: number | null = null;
  @Output() classSelected = new EventEmitter<CourseClass>();

  public estaExpandido: boolean = false;

  toggleModulo() {
    this.estaExpandido = !this.estaExpandido;
  }

  selecionarAula(aula: CourseClass): void {
    this.classSelected.emit(aula);
  }
}
