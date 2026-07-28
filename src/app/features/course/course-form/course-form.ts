import { Component, ElementRef, OnInit, ViewChild, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Observable, forkJoin } from 'rxjs';
import { ModuleForm, ModuleFormValue } from './module-form/module-form';
import { ClassForm, ClassFormValue } from './class-form/class-form';
import { CustomButton } from '../../../shared/components/custom-button/custom-button';
import { CourseService } from '../../../services/course_service';
import { ClassPayload, CourseClass, CourseClassDetail, CourseFull, CourseModule, ModulePayload } from '../../../models/course';

type CurriculumView = 'empty' | 'module' | 'class';

function slugify(text: string): string {
  return text
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

@Component({
  selector: 'app-course-form',
  standalone: true,
  imports: [ReactiveFormsModule, CustomButton, ModuleForm, ClassForm],
  templateUrl: './course-form.html',
  styleUrl: './course-form.css'
})
export class CourseForm implements OnInit {
  @ViewChild('bannerInput') bannerInputRef?: ElementRef<HTMLInputElement>;

  private fb = inject(FormBuilder);
  private courseService = inject(CourseService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  isEditMode = false;
  private courseId: number | null = null;
  private courseSlug = '';

  isLoading = signal(false);
  isSaving = signal(false);
  errorMessage = signal<string | null>(null);
  successMessage = signal<string | null>(null);

  savedCourseId = signal<number | null>(null);
  savedModules = signal<CourseModule[]>([]);

  bannerFile = signal<File | null>(null);
  bannerPreviewUrl = signal<string | null>(null);

  currentView = signal<CurriculumView>('empty');
  selectedModuleForEdit = signal<CourseModule | null>(null);
  selectedClassForEdit = signal<CourseClassDetail | null>(null);
  private currentModuleIdForClass = signal<number | null>(null);

  private expandedModuleIds = signal<Set<number>>(new Set());

  courseForm: FormGroup = this.fb.group({
    title: ['', [Validators.required]],
    description: ['', [Validators.required]]
  });

  get f() {
    return this.courseForm.controls;
  }

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.isEditMode = true;
      this.courseId = Number(idParam);

      const navState = history.state as { justCreated?: boolean };
      if (navState?.justCreated) {
        this.successMessage.set('Curso criado com sucesso! Agora adicione módulos e aulas.');
      }

      this.loadCourse(this.courseId);
    }
  }

  private loadCourse(courseId: number): void {
    this.isLoading.set(true);
    this.courseService.getCourseById(courseId).subscribe({
      next: (course: CourseFull) => {
        this.courseSlug = course.slug;

        this.courseForm.patchValue({
          title: course.title,
          description: course.description
        });
  
        this.bannerPreviewUrl.set(course.banner_url ?? null);

        this.savedCourseId.set(course.id_course);
        this.savedModules.set(
          course.modules.map(module => ({
            module_id: module.module_id,
            title: module.title,
            index_order: module.index_order,
            classes: module.classes.map(courseClass => ({
              class_id: courseClass.class_id,
              title: courseClass.title,
              is_completed: courseClass.is_completed
            }))
          }))
        );

        this.isLoading.set(false);
      },
      error: () => {
        this.errorMessage.set('Não foi possível carregar o curso.');
        this.isLoading.set(false);
      }
    });
  }

  onBannerFileChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) {
      return;
    }

    this.bannerFile.set(file);
    this.bannerPreviewUrl.set(URL.createObjectURL(file));
  }

  removeBanner(): void {
    this.bannerFile.set(null);
    this.bannerPreviewUrl.set(null);
    if (this.bannerInputRef) {
      this.bannerInputRef.nativeElement.value = '';
    }
  }

  saveCourse(): void {
    if (this.courseForm.invalid) {
      this.courseForm.markAllAsTouched();
      return;
    }

    this.errorMessage.set(null);
    this.successMessage.set(null);
    this.isSaving.set(true);

    const { title, description } = this.courseForm.getRawValue();

    if (this.isEditMode && this.courseId) {
      this.courseService
        .updateCourse(this.courseId, { title, description, slug: this.courseSlug })
        .subscribe({
          next: () => {
            this.isSaving.set(false);
            this.successMessage.set('Curso atualizado com sucesso.');
          },
          error: () => {
            this.isSaving.set(false);
            this.errorMessage.set('Erro ao atualizar o curso.');
          }
        });
      return;
    }

    const slug = slugify(title);

    this.courseService
      .createCourse({ title, slug, description }, this.bannerFile() ?? undefined)
      .subscribe({
        next: res => {
          this.router.navigate(['/courses', res.course_id, 'edit'], {
            replaceUrl: true,
            state: { justCreated: true }
          });
        },
        error: err => {
          this.isSaving.set(false);
          if (err?.status === 409) {
            this.errorMessage.set('Já existe um curso com esse título/slug. Tente outro nome.');
          } else {
            this.errorMessage.set('Erro ao criar o curso.');
          }
        }
      });
  }

  isExpanded(moduleId: number): boolean {
    return this.expandedModuleIds().has(moduleId);
  }

  toggleModule(moduleId: number): void {
    const next = new Set(this.expandedModuleIds());
    if (next.has(moduleId)) {
      next.delete(moduleId);
    } else {
      next.add(moduleId);
    }
    this.expandedModuleIds.set(next);
  }

  openModuleForm(): void {
    this.errorMessage.set(null);
    this.selectedModuleForEdit.set(null);
    this.currentView.set('module');
  }

  openModuleFormForEdit(modulo: CourseModule): void {
    this.errorMessage.set(null);

    this.courseService.getModuleWithClasses(modulo.module_id).subscribe({
      next: full => {
        this.selectedModuleForEdit.set({
          module_id: full.module_id,
          title: full.title,
          description: full.description,
          index_order: full.index_order,
          classes: modulo.classes
        });
        this.currentView.set('module');
      },
      error: () => this.errorMessage.set('Erro ao carregar módulo para edição.')
    });
  }

  onSaveModule(value: ModuleFormValue): void {
    const editing = this.selectedModuleForEdit();
    const courseId = this.savedCourseId();

    this.errorMessage.set(null);

    if (editing) {
      const updatePayload: Partial<ModulePayload> = {
        title: value.title,
        description: value.description ?? ''
      };
      this.courseService.updateModule(editing.module_id, updatePayload).subscribe({
        next: res => {
          this.savedModules.update(modules =>
            modules.map(m =>
              m.module_id === editing.module_id
                ? { ...m, title: res.module.title, description: res.module.description }
                : m
            )
          );
          this.currentView.set('empty');
          this.selectedModuleForEdit.set(null);
        },
        error: () => this.errorMessage.set('Erro ao atualizar módulo.')
      });
      return;
    }

    if (!courseId) {
      this.errorMessage.set('Salve o curso antes de adicionar módulos.');
      return;
    }

    const payload: ModulePayload = {
      title: value.title,
      description: value.description ?? '',
      index_order: this.savedModules().length,
      fk_course: courseId
    };

    this.courseService.createModule(payload).subscribe({
      next: res => {
        const newModule: CourseModule = {
          module_id: res.moduleId,
          title: value.title,
          description: value.description,
          index_order: payload.index_order,
          classes: []
        };
        this.savedModules.update(modules => [...modules, newModule]);
        this.currentView.set('empty');
      },
      error: () => this.errorMessage.set('Erro ao criar módulo.')
    });
  }

  openClassForm(moduleId: number): void {
    this.errorMessage.set(null);
    this.selectedClassForEdit.set(null);
    this.currentModuleIdForClass.set(moduleId);
    this.currentView.set('class');
  }

  openClassFormForEdit(aula: CourseClass, moduleId: number): void {
    this.errorMessage.set(null);
    this.currentModuleIdForClass.set(moduleId);

    this.courseService.getClassById(aula.class_id).subscribe({
      next: full => {
        this.selectedClassForEdit.set(full);
        this.currentView.set('class');
      },
      error: () => this.errorMessage.set('Erro ao carregar aula para edição.')
    });
  }

  onSaveClass(value: ClassFormValue): void {
    const editing = this.selectedClassForEdit();
    const moduleId = this.currentModuleIdForClass();

    this.errorMessage.set(null);

    if (editing) {
      this.courseService
        .updateClass(editing.class_id, { title: value.title, description: value.description })
        .subscribe({
          next: () => {
            this.syncClassFile(editing.class_id, value, () => {
              this.savedModules.update(modules =>
                modules.map(m =>
                  m.module_id === moduleId
                    ? {
                        ...m,
                        classes: m.classes.map(c =>
                          c.class_id === editing.class_id ? { ...c, title: value.title } : c
                        )
                      }
                    : m
                )
              );
              this.currentView.set('empty');
              this.selectedClassForEdit.set(null);
            });
          },
          error: () => this.errorMessage.set('Erro ao atualizar aula.')
        });
      return;
    }

    if (!moduleId) {
      this.errorMessage.set('Selecione um módulo antes de adicionar a aula.');
      return;
    }

    const targetModule = this.savedModules().find(m => m.module_id === moduleId);

    const payload: ClassPayload = {
      title: value.title,
      description: value.description,
      index_order: targetModule?.classes.length ?? 0,
      fk_module: moduleId
    };

    this.courseService.createClass(payload).subscribe({
      next: res => {
        this.syncClassFile(res.class_id, value, () => {
          const newClass: CourseClass = {
            class_id: res.class_id,
            title: value.title,
            description: value.description,
            index_order: payload.index_order
          };
          this.savedModules.update(modules =>
            modules.map(m =>
              m.module_id === moduleId ? { ...m, classes: [...m.classes, newClass] } : m
            )
          );
          this.currentView.set('empty');
        });
      },
      error: () => this.errorMessage.set('Erro ao criar aula.')
    });
  }

  private syncClassFile(classId: number, value: ClassFormValue, done: () => void): void {
    const tasks: Observable<any>[] = [];

    if (value.removedMaterialId) {
      tasks.push(this.courseService.deleteClassFile(value.removedMaterialId));
    }
    if (value.file) {
      tasks.push(this.courseService.uploadClassFile(classId, value.file));
    }

    if (tasks.length === 0) {
      done();
      return;
    }

    forkJoin(tasks).subscribe({
      next: () => done(),
      error: () => {
        this.errorMessage.set('Aula salva, mas houve um erro ao processar o arquivo.');
        done();
      }
    });
  }
}