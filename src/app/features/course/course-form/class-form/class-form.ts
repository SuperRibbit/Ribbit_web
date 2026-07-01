import { Component, EventEmitter, Input, Output, inject, OnChanges, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CustomButton } from "../../../../shared/components/custom-button/custom-button";

@Component({
  selector: 'app-class-form',
  templateUrl: './class-form.html',
  standalone: true,
  imports: [ReactiveFormsModule, CustomButton],
  styleUrl: '../course-form.css'
})
export class ClassForm implements OnChanges {
  private fb = inject(FormBuilder);
  
  @Input() editData: any | null = null;
  @Output() saveClass = new EventEmitter<{ form: any, file: File | null }>();

  classForm: FormGroup = this.fb.group({
    title: ['', Validators.required],
    description: ['', Validators.required]
  });

  selectedFile: File | null = null;

  get f() { return this.classForm.controls; }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['editData'] && this.editData) {
      this.classForm.patchValue({
        title: this.editData.title,
        description: this.editData.description
      });
    } else {
      this.classForm.reset();
      this.selectedFile = null;
    }
  }

  onFileChange(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      this.selectedFile = file;
    }
  }

  removeFile(): void {
    this.selectedFile = null;
  }

  onSubmit(): void {
    if (this.classForm.valid) {
      this.saveClass.emit({
        form: this.classForm.value,
        file: this.selectedFile
      });
    }
  }
}