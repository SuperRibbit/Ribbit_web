import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CourseFull } from '../../../models/course';

@Component({
  selector: 'app-admin-courses',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './admin-courses.html',
  styleUrls: ['./admin-courses.css']
})
export class AdminCourses {
  searchTerm = '';

  courses: CourseFull[] = [
    {
      id_course: 1,
      title: 'Desenvolvimento Web com Angular',
      slug: 'desenvolvimento-web-com-angular',
      description: 'Aprenda Angular do zero ao avançado com boas práticas.',
      banner_url: 'https://via.placeholder.com/150',
      teacher_name: 'Bruna Serra',
      progress: 0,
      modules: [
        {
          module_id: 101,
          title: 'Módulo 1: Introdução e Componentes',
          index_order: 1,
          classes: [
            { class_id: 1001, title: 'Criando o Projeto', is_completed: false },
            { class_id: 1002, title: 'Sintaxe Control Flow (@if/@for)', is_completed: false }
          ]
        }
      ]
    },
    {
      id_course: 2,
      title: 'Estrutura de Dados em Java',
      slug: 'estrutura-de-dados-em-java',
      description: 'Conceitos fundamentais de listas, pilhas e filas.',
      banner_url: '',
      teacher_name: 'Professor Auxiliar',
      progress: 0,
      modules: []
    }
  ];

  constructor(private router: Router) {}

  get filteredCourses(): CourseFull[] {
    if (!this.searchTerm.trim()) {
      return this.courses;
    }
    const term = this.searchTerm.toLowerCase();
    return this.courses.filter(course =>
      course.title.toLowerCase().includes(term) ||
      course.teacher_name.toLowerCase().includes(term) ||
      course.slug.toLowerCase().includes(term)
    );
  }

  onViewCourse(courseId: number): void {
    this.router.navigate(['/courses', courseId]);
  }

  onEditCourse(courseId: number): void {
    this.router.navigate(['/courses', courseId, 'edit']);
  }

  onCreateCourse(): void {
    this.router.navigate(['/courses/new']);
  }
}