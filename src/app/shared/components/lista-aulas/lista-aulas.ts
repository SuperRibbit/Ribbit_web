import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-lista-aulas',
  imports: [],
  templateUrl: './lista-aulas.html',
  styleUrl: './lista-aulas.css',
})
export class ListaAulas {
  @Input() aulas: any[] = [];
}
