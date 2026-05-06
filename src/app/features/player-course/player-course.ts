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
    title: "Introdução ao Scratch",
    banner_url: "assets/imageScratch.png",
    modules: [
      {
        id_module: "m1",
        title: "Módulo 1",
        classes: [
          { class_id: 1, title: "Aula 1", is_completed: true }
        ]
      }
    ]
  };
}

