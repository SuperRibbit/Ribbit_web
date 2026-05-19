import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { CustomButton } from "../../../../shared/components/custom-button/custom-button";
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Auth } from '../../../../services/auth';

@Component({
  selector: 'app-mail',
  imports: [CustomButton, FormsModule, ReactiveFormsModule],
  templateUrl: './mail.html',
  styleUrl: '../password_reset.css',
})
export class Mail {
  private fb = inject(FormBuilder);
  private authService = inject(Auth);
  private cdr = inject(ChangeDetectorRef);

  successMessage = '';
  errorMessage = '';

  mailForm: FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
  });

  onSubmit() {

    this.successMessage = '';
    this.errorMessage = '';

    if (this.mailForm.invalid) {
      this.mailForm.markAllAsTouched();
      return;
    }

    const email = this.mailForm.value.email;

    this.authService.forgotPassword(email).subscribe({
      next: (response) => {
        this.successMessage = response.message;
        this.cdr.detectChanges();
      },
      error: () => {
        this.errorMessage =
          'Não foi possível enviar o email de recuperação.';
          this.cdr.detectChanges();
      }
    });
  }
}