import { Component } from '@angular/core';
import { Modules } from '../../shared/components/modules/modules';

@Component({
  selector: 'app-player-course',
  imports: [Modules],
  templateUrl: './player-course.html',
  styleUrl: './player-course.css',
})
export class PlayerCourse {
  public curso = {
    id: "c1",
    title: "Introdução ao Scratch",
    banner_url: "assets/imageScratch.png",
    modules: [
      {
        id_module: "m1",
        title: "1. Primeiros Passos",
        index_order: 1,
        classes: [
          { class_id: 101, title: "O que é o Scratch?", is_completed: true },
          { class_id: 102, title: "Criando sua conta", is_completed: true },
          { class_id: 103, title: "Interface do Editor", is_completed: false }
        ]
      },
      {
        id_module: "m2",
        title: "2. Comandos de Movimento",
        index_order: 2,
        classes: [
          { class_id: 201, title: "Movendo o ator", is_completed: false },
          { class_id: 202, title: "Usando graus e direção", is_completed: false },
          { class_id: 203, title: "Desafio: O Quadrado", is_completed: false }
        ]
      },
      {
        id_module: "m3",
        title: "3. Eventos e Sensores",
        index_order: 3,
        classes: [
          { class_id: 301, title: "Quando a bandeira for clicada", is_completed: false },
          { class_id: 302, title: "Tocando em outros objetos", is_completed: false }
        ]
      }
    ]
  };
}

