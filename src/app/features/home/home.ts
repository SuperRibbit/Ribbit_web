import { Component, computed, inject, signal } from '@angular/core';
import { CardCursoHome } from "../../shared/components/card-curso-home/card-curso-home";
import { CardCursoDashboard } from "../../shared/components/card-curso-dashboard/card-curso-dashboard";
import { Footer } from "../../core/footer/footer";
import { Pagination } from "../../shared/components/pagination/pagination";
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';
import { EnrollmentsService } from '../../services/enrollments_service';
import { CourseService } from '../../services/course_service';

@Component({
  selector: 'app-home',
  imports: [CardCursoHome, CardCursoDashboard, Footer, Pagination],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {
  private courseService = inject(CourseService);
  private enrollmentsService = inject(EnrollmentsService);
  listaAtividadesRecentes = signal<any[]>([]);

  readonly cursosPorPagina = 20;
  catalogoPage = signal(1);

  public listaCursos = toSignal(
    this.courseService.getCourses().pipe(
      map((response: { courses: any; }) => response?.courses || [])
    ),
    { initialValue: [] }
  );

  public totalCatalogoPages = computed(() =>
    Math.max(1, Math.ceil(this.listaCursos().length / this.cursosPorPagina))
  );

  public listaCursosPaginada = computed(() => {
    const inicio = (this.catalogoPage() - 1) * this.cursosPorPagina;
    return this.listaCursos().slice(inicio, inicio + this.cursosPorPagina);
  });

  onCatalogoPageChange(page: number) {
    this.catalogoPage.set(page);
  }

  ngOnInit() {
    this.enrollmentsService.getMyCourses().subscribe({
      next: (response) => {
        this.listaAtividadesRecentes.set(response.courses); 
      },
      error: (err) => console.error('Erro ao buscar atividades recentes', err)
    });
  }
}