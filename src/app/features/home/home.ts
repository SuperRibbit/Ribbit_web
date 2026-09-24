import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CardCursoHome } from "../../shared/components/card-curso-home/card-curso-home";
import { CardCursoDashboard } from "../../shared/components/card-curso-dashboard/card-curso-dashboard";
import { Footer } from "../../core/footer/footer";
import { Pagination } from "../../shared/components/pagination/pagination";
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { catchError, debounce, distinctUntilChanged, map, of, switchMap, timer } from 'rxjs';
import { EnrollmentsService } from '../../services/enrollments_service';
import { CourseService } from '../../services/course_service';

@Component({
  selector: 'app-home',
  imports: [CardCursoHome, CardCursoDashboard, Footer, Pagination, FormsModule],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {
  private courseService = inject(CourseService);
  private enrollmentsService = inject(EnrollmentsService);
  listaAtividadesRecentes = signal<any[]>([]);

  readonly cursosPorPagina = 20;
  catalogoPage = signal(1);
  searchTerm = signal('');

  public listaCursos = toSignal(
    toObservable(this.searchTerm).pipe(
      map(term => term.trim()),
      debounce(term => timer(term ? 300 : 0)),
      distinctUntilChanged(),
      switchMap(term =>
        this.courseService.getCourses(term || undefined).pipe(
          map((response: { courses?: any[] }) => response?.courses ?? []),
          catchError(() => of([]))
        )
      )
    ),
    { initialValue: [] as any[] }
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

  onSearchTermChange(term: string) {
    this.searchTerm.set(term);
    this.catalogoPage.set(1);
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