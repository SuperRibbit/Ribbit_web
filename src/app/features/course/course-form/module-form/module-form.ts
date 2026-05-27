import { Component, EventEmitter, inject, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CustomButton } from '../../../../shared/components/custom-button/custom-button';

@Component({
  selector: 'app-module-form',
  standalone: true,
  imports: [ReactiveFormsModule, CustomButton],
  templateUrl: './module-form.html',
  styleUrl: '../course-form.css'
})
export class ModuleForm {
  private fb = inject(FormBuilder);

  @Output() saveModule = new EventEmitter<{ title: string }>();

  moduleForm: FormGroup = this.fb.group({
    title: ['', Validators.required]
  });

  get f() { return this.moduleForm.controls; }

  onSubmit() {
    if (this.moduleForm.valid) {
      this.saveModule.emit(this.moduleForm.value);
      this.moduleForm.reset();
    }
  }
}