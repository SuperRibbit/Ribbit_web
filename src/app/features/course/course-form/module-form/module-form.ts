import { Component, EventEmitter, Output, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CustomButton } from "../../../../shared/components/custom-button/custom-button";

@Component({
  selector: 'app-module-form',
  templateUrl: './module-form.html',
  standalone: true,
  imports: [ReactiveFormsModule, CustomButton],
  styleUrl: '../course-form.css'
})
export class ModuleForm {
  private fb = inject(FormBuilder);
  @Output() saveModule = new EventEmitter<any>();

  moduleForm: FormGroup = this.fb.group({
    title: ['', Validators.required],
    description: ['']
  });

  get f() { return this.moduleForm.controls; }

  onSubmit(): void {
    if (this.moduleForm.valid) {
      this.saveModule.emit(this.moduleForm.value);
      this.moduleForm.reset();
    }
  }
}