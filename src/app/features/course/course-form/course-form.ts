import { Component, signal, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CourseModule } from '../../../models/course';
import { CourseService } from '../../../services/course_service';
import { CustomButton } from "../../../shared/components/custom-button/custom-button";
import { ClassForm } from "./class-form/class-form";
import { ModuleForm } from "./module-form/module-form";

@Component({
  selector: 'app-course-form',
  templateUrl: './course-form.html',
  styleUrls: ['./course-form.css'],
  standalone: true,
  imports: [ReactiveFormsModule, CustomButton, ClassForm, ModuleForm, ClassForm]
})
export class CourseForm {
  private fb = inject(FormBuilder);
  private courseService = inject(CourseService);

  courseForm: FormGroup = this.fb.group({
    title: ['', [Validators.required, Validators.minLength(3)]],
    description: ['', [Validators.required]]
  });

  bannerPreviewUrl = signal<string | ArrayBuffer | null>(null);
  isSaving = signal<boolean>(false);
  savedCourseId = signal<number | null>(null);
  savedModules = signal<CourseModule[]>([]);
  currentView = signal<'empty' | 'module' | 'class'>('empty');
  
  errorMessage = signal<string | null>(null);
  successMessage = signal<string | null>(null);
  
  selectedClassForEdit = signal<any | null>(null);
  expandedModules = signal<Set<number>>(new Set());
  
  private bannerFile: File | null = null;
  private targetModuleIdForClass: number | null = null;

  get f() { return this.courseForm.controls; }

  onBannerFileChange(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      this.bannerFile = file;
      const reader = new FileReader();
      reader.onload = () => this.bannerPreviewUrl.set(reader.result);
      reader.readAsDataURL(file);
    }
  }

  removeBanner(): void {
    this.bannerFile = null;
    this.bannerPreviewUrl.set(null);
  }

  createCourse(): void {
    if (this.courseForm.invalid) return;

    this.isSaving.set(true);
    this.errorMessage.set(null);

    const formValue = this.courseForm.value;
    const slug = formValue.title.toLowerCase().replace(/[\s\W-]+/g, '-');

    const payload = { ...formValue, slug };

    this.courseService.createCourse(payload, this.bannerFile || undefined).subscribe({
      next: (res) => {
        this.savedCourseId.set(res.course_id);
        this.successMessage.set(res.message);
        this.isSaving.set(false);
      },
      error: (err) => {
        this.errorMessage.set(err.error?.message || 'Erro ao criar curso.');
        this.isSaving.set(false);
      }
    });
  }

  toggleModule(moduleId: number): void {
    const currentSet = new Set(this.expandedModules());
    if (currentSet.has(moduleId)) {
      currentSet.delete(moduleId);
    } else {
      currentSet.add(moduleId);
    }
    this.expandedModules.set(currentSet);
  }

  isExpanded(moduleId: number): boolean {
    return this.expandedModules().has(moduleId);
  }

  openModuleForm(): void {
    this.currentView.set('module');
  }

  openClassForm(moduleId: number): void {
    this.targetModuleIdForClass = moduleId;
    this.selectedClassForEdit.set(null);
    this.currentView.set('class');
    this.toggleModule(moduleId);
  }

  openClassFormForEdit(aula: any, moduleId: number): void {
    this.targetModuleIdForClass = moduleId;
    this.selectedClassForEdit.set(aula);
    this.currentView.set('class');
  }

  onSaveModule(moduleData: any): void {
    const courseId = this.savedCourseId();
    if (!courseId) return;

    const payload = {
      ...moduleData,
      fk_course: courseId,
      index_order: this.savedModules().length + 1
    };

    this.courseService.createModule(payload).subscribe({
      next: (newModule) => {
        this.savedModules.update(modules => [...modules, { ...newModule, classes: [] }]);
        this.currentView.set('empty');
        this.successMessage.set('Módulo criado com sucesso!');
      },
      error: (err) => this.errorMessage.set(err.error?.message || 'Erro ao criar módulo.')
    });
  }

  onSaveClass(classData: { form: any, file: File | null }): void {
    if (!this.targetModuleIdForClass) return;

    const targetModule = this.savedModules().find(m => m.module_id === this.targetModuleIdForClass);
    const orderIndex = targetModule ? targetModule.classes.length + 1 : 1;

    const payload = {
      ...classData.form,
      fk_module: this.targetModuleIdForClass,
      index_order: orderIndex
    };

    this.courseService.createClass(payload).subscribe({
      next: (newClass) => {
        if (classData.file) {
           this.courseService.uploadClassFile(newClass.class_id, classData.file).subscribe({
             next: () => this.finalizeClassCreation(newClass),
             error: (err) => this.errorMessage.set(err.error?.message || 'Erro ao enviar o arquivo da aula.')
           });
        } else {
           this.finalizeClassCreation(newClass);
        }
      },
      error: (err) => this.errorMessage.set(err.error?.message || 'Erro ao criar aula.')
    });
  }

  private finalizeClassCreation(newClass: any): void {
    this.savedModules.update(modules => {
      return modules.map(m => {
        if (m.module_id === this.targetModuleIdForClass) {
          return { ...m, classes: [...m.classes, newClass] };
        }
        return m;
      });
    });
    
    this.currentView.set('empty');
    this.successMessage.set('Aula criada com sucesso!');
  }
}