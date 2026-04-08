import { Component } from '@angular/core';
import { ListaAulas } from "../../shared/components/lista-aulas/lista-aulas";

@Component({
  selector: 'app-course',
  imports: [ListaAulas],
  templateUrl: './course.html',
  styleUrl: './course.css',
})
export class Course {
  public curso: any = {
    title: 'Nome do Curso',
    description: 'Carregando descrição...',
    banner_url: 'assets/scratch-logo.png',
    modules: [
      { module_id: 1, title: 'Introdução ao Scratch' },
      { module_id: 2, title: 'Configurando o Ambiente' },
      { module_id: 3, title: 'Primeiros Passos' }
    ]
  };
}
