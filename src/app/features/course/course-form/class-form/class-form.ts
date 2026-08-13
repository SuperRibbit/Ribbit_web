import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgxJoditComponent } from 'ngx-jodit';
import type { Config } from 'jodit/esm/config';
import { CustomButton } from '../../../../shared/components/custom-button/custom-button';
import { ClassMaterial, CourseClassDetail } from '../../../../models/course';


export interface ClassFormValue {
  title: string;
  description: string;
  file?: File | null;
  removedMaterialId?: number;
}

@Component({
  selector: 'app-class-form',
  standalone: true,
  imports: [ReactiveFormsModule, CustomButton, NgxJoditComponent],
  templateUrl: './class-form.html',
  styleUrl: '../course-form.css'
})
export class ClassForm implements OnChanges {
  private fb = inject(FormBuilder);

  @Input() editData: CourseClassDetail | null = null;

  @Output() saveClass = new EventEmitter<ClassFormValue>();

  selectedFile: File | { name: string } | null = null;

  joditOptions: Partial<Config> = {
    height: 220,
    toolbarButtonSize: 'middle',
    buttons: [
      'bold', 'italic', 'underline', 'strikethrough', '|',
      'ul', 'ol', '|',
      'link', '|',
      'undo', 'redo'
    ]
  };

  private existingMaterial: ClassMaterial | null = null;
  private materialToRemove: number | null = null;

  classForm: FormGroup = this.fb.group({
    title: ['', [Validators.required]],
    description: ['', [Validators.required]]
  });

  get f() {
    return this.classForm.controls;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (!changes['editData']) {
      return;
    }

    this.materialToRemove = null;

    if (this.editData) {
      this.classForm.setValue({
        title: this.editData.title,
        description: this.editData.description ?? ''
      });

      const firstMaterial = this.editData.materials?.[0] ?? null;
      this.existingMaterial = firstMaterial;
      this.selectedFile = firstMaterial ? { name: firstMaterial.display_name } : null;
    } else {
      this.classForm.reset({ title: '', description: '' });
      this.existingMaterial = null;
      this.selectedFile = null;
    }

    this.classForm.markAsPristine();
    this.classForm.markAsUntouched();
  }

  onFileChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) {
      return;
    }

    this.materialToRemove = null;
    this.selectedFile = file;
  }

  removeFile(): void {
    if (this.existingMaterial && !(this.selectedFile instanceof File)) {
      this.materialToRemove = this.existingMaterial.file_id;
    }
    this.selectedFile = null;
  }

  onSubmit(): void {
    if (this.classForm.invalid) {
      this.classForm.markAllAsTouched();
      return;
    }

    const raw = this.classForm.getRawValue();
    const isNewFile = this.selectedFile instanceof File;

    this.saveClass.emit({
      title: raw.title,
      description: raw.description,
      file: isNewFile ? (this.selectedFile as File) : null,
      removedMaterialId: this.materialToRemove ?? undefined
    });
  }
}