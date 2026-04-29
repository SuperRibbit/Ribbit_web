import { Component } from '@angular/core';
import { Modules } from "../../shared/components/modules/modules";

@Component({
  selector: 'app-course',
  imports: [Modules],
  templateUrl: './course.html',
  styleUrl: './course.css',
})
export class Course {
  public curso: any = {
  title: 'Nome do Curso',
  modules: [
    { 
      module_id: 1, 
      title: 'Introdução ao Scratch',
      classes: [
        { class_id: 101, title: 'O que é Scratch?', is_completed: true },
        { class_id: 102, title: 'Interface do Usuário', is_completed: false }
      ]
    },
    { 
      module_id: 2, 
      title: 'Configurando o Ambiente',
      classes: [
        { class_id: 201, title: 'Instalando Extensões', is_completed: false }
      ]
    }
  ]
};
}
