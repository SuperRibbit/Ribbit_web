import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-card-curso-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './card-curso-home.html',
  styleUrl: './card-curso-home.css',
})
export class CardCursoHome {
  @Input() curso: any;
}
