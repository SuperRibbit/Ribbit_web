import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-modules',
  imports: [CommonModule],
  templateUrl: './modules.html',
  styleUrl: './modules.css',
})
export class Modules {
  @Input() modules: any;
  @Input() activeClassId: number | null = null;
  @Output() classSelected = new EventEmitter<any>();

  public estaExpandido: boolean = false;

  toggleModulo() {
    this.estaExpandido = !this.estaExpandido;
  }

  selecionarAula(aula: any): void {
    this.classSelected.emit(aula);
  }
}