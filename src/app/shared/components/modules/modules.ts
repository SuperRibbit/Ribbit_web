import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-modules',
  imports: [CommonModule],
  templateUrl: './modules.html',
  styleUrl: './modules.css',
})
export class Modules {
  @Input() modules: any;
  public estaExpandido: boolean = false;

  toggleModulo() {
    this.estaExpandido = !this.estaExpandido;
  }
}
