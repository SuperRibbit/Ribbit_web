import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CustomButton } from '../../../../shared/components/custom-button/custom-button';
import { CourseModule } from '../../../../models/course';

export interface ModuleFormValue {
  title: string;
  description: string;
}

@Component({
  selector: 'app-module-form',
  standalone: true,
  imports: [ReactiveFormsModule, CustomButton],
  templateUrl: './module-form.html',
  styleUrl: '../course-form.css'
})
export class ModuleForm implements OnChanges {
  private fb = inject(FormBuilder);

  @Input() editData: CourseModule | null = null;

  @Output() saveModule = new EventEmitter<ModuleFormValue>();

  moduleForm: FormGroup = this.fb.group({
    title: ['', [Validators.required]],
    description: ['']
  });

  get f() {
    return this.moduleForm.controls;
  }

  get isEditMode(): boolean {
    return !!this.editData;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (!changes['editData']) {
      return;
    }

    if (this.editData) {
      this.moduleForm.setValue({
        title: this.editData.title,
        description: this.editData.description ?? ''
      });
    } else {
      this.moduleForm.reset({ title: '', description: '' });
    }

    this.moduleForm.markAsPristine();
    this.moduleForm.markAsUntouched();
  }

  onSubmit(): void {
    if (this.moduleForm.invalid) {
      this.moduleForm.markAllAsTouched();
      return;
    }

    const raw = this.moduleForm.getRawValue();

    this.saveModule.emit({
      title: raw.title,
      description: raw.description ?? ''
    });
  }
}