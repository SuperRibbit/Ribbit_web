import { Component, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { lastValueFrom } from 'rxjs';
import { ModuleForm } from './module-form/module-form';
import { ClassForm } from './class-form/class-form';
import { CourseService } from '../../../services/course_service';
import { Course, CreateClassPayload, CreateModulePayload, DraftClass, DraftModule } from '../../../models/course';
import { CustomButton } from "../../../shared/components/custom-button/custom-button";

@Component({
  selector: 'app-course-editor',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, ModuleForm, ClassForm, CustomButton],
  templateUrl: './course-form.html',
  styleUrl: './course-form.css'
})
export class CourseForm {
  private fb = inject(FormBuilder);
  private courseService = inject(CourseService);

  modulesDraft = signal<DraftModule[]>([]);

  currentView = signal<'module' | 'class' | 'empty'>('empty');
  selectedModuleTempId = signal<number | null>(null);
  expandedModules = signal<Set<number>>(new Set());
  isSaving = signal(false);

  errorMessage = signal<string | null>(null);
  successMessage = signal<string | null>(null);

  courseForm: FormGroup = this.fb.group({
    title: ['', Validators.required],
    description: ['', Validators.required],
    banner_url: ['']
  });

  get f() { return this.courseForm.controls; }

  onAddModuleDraft(data: { title: string }) {
    const newModule: DraftModule = {
      tempId: Date.now(),
      title: data.title,
      classes: []
    };
    this.modulesDraft.update(modules => [...modules, newModule]);
    this.currentView.set('empty');
  }

  onAddClassDraft(data: { title: string, description: string, file_url: string }) {
    const targetModuleId = this.selectedModuleTempId();
    if (!targetModuleId) return;

    const newClass: DraftClass = {
      tempId: Date.now(),
      ...data
    };

    this.modulesDraft.update(modules =>
      modules.map(mod =>
        mod.tempId === targetModuleId
          ? { ...mod, classes: [...mod.classes, newClass] }
          : mod
      )
    );
    this.currentView.set('empty');
  }

  async saveEverything() {
    this.errorMessage.set(null);
    this.successMessage.set(null);

    if (this.courseForm.invalid) {
      this.errorMessage.set('Preencha os dados básicos do curso antes de salvar.');
      return;
    }

    this.isSaving.set(true);

    try {
      const courseData: Course = {
        ...this.courseForm.value,
        slug: this.courseForm.value.title.toLowerCase().replace(/ /g, '-')
      };

      const courseResponse = await lastValueFrom(
        this.courseService.createCourse(courseData)
      );

      const realCourseId = courseResponse.course_id;

      let moduleIndex = 1;
      for (const draftMod of this.modulesDraft()) {

        const modulePayload: CreateModulePayload = {
          title: draftMod.title,
          description: '',
          index_order: moduleIndex++,
          fk_course: realCourseId
        };

        const moduleResponse = await lastValueFrom(
          this.courseService.createModule(modulePayload)
        );

        const realModuleId = moduleResponse.moduleId;

        let classIndex = 1;
        for (const draftClass of draftMod.classes) {

          const classPayload: CreateClassPayload = {
            title: draftClass.title,
            description: draftClass.description,
            index_order: classIndex++,
            fk_module: realModuleId
          };

          await lastValueFrom(
            this.courseService.createClass(classPayload)
          );
        }
      }

      this.successMessage.set('Curso salvo com sucesso!');

    } catch (error: any) {
      const msg = error?.error?.message ?? 'Erro desconhecido. Verifique o console.';
      console.error('Erro ao salvar:', error);
      this.errorMessage.set(msg);
    } finally {
      this.isSaving.set(false);
    }
  }

  openModuleForm() {
    this.currentView.set('module');
  }

  openClassForm(moduleTempId: number) {
    this.selectedModuleTempId.set(moduleTempId);
    this.currentView.set('class');
  }

  toggleModule(tempId: number) {
    this.expandedModules.update(current => {
      const next = new Set(current);
      next.has(tempId) ? next.delete(tempId) : next.add(tempId);
      return next;
    });
  }

  isExpanded(tempId: number): boolean {
    return this.expandedModules().has(tempId);
  }

  openModuleFormForEdit(modulo: DraftModule) {
    // futuramente: pré-preencher o form com os dados do módulo
    this.selectedModuleTempId.set(modulo.tempId);
    this.currentView.set('module');
  }

  openClassFormForEdit(aula: DraftClass, moduleTempId: number) {
    // futuramente: pré-preencher o form com os dados da aula
    this.selectedModuleTempId.set(moduleTempId);
    this.currentView.set('class');
  }
}