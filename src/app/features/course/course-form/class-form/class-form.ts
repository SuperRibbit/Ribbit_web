import { Component, EventEmitter, inject, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CustomButton } from '../../../../shared/components/custom-button/custom-button';

@Component({
  selector: 'app-class-form',
  standalone: true,
  imports: [ReactiveFormsModule, CustomButton],
  templateUrl: './class-form.html',
  styleUrl: '../course-form.css'
})
export class ClassForm {
  private fb = inject(FormBuilder);

  @Output() saveClass = new EventEmitter<{ title: string, description: string, file_url: string }>();

  classForm: FormGroup = this.fb.group({
    title: ['', Validators.required],
    description: ['', Validators.required],
    file_url: ['']
  });

  get f() { return this.classForm.controls; }

  onSubmit() {
    if (this.classForm.valid) {
      this.saveClass.emit(this.classForm.value);
      this.classForm.reset();
    }
  }
}