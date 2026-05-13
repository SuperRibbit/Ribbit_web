import { Component, inject } from '@angular/core';
import { CustomButton } from "../../../../shared/components/custom-button/custom-button";
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Auth } from '../../../../services/auth';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-reset',
  imports: [CustomButton, FormsModule, ReactiveFormsModule],
  templateUrl: './reset.html',
  styleUrl: '../password_reset.css',
})
export class Reset {
  private fb = inject(FormBuilder);
  private authService = inject(Auth);
  private route = inject(ActivatedRoute);

  successMessage = '';
  errorMessage = '';

  resetForm: FormGroup = this.fb.group({
    password: ['', [Validators.required, Validators.minLength(6)]],
    confirmPassword: ['', [Validators.required, Validators.minLength(6)]]
  });

  onSubmit() {
    this.successMessage = '';
    this.errorMessage = '';

    if (this.resetForm.invalid) {
      this.resetForm.markAllAsTouched();
      return;
    }

    const password = this.resetForm.value.password;
    const confirmPassword = this.resetForm.value.confirmPassword;

    if (password !== confirmPassword) {
      this.errorMessage = 'As senhas não coincidem.';
      return;
    }

    const token = this.route.snapshot.queryParamMap.get('token');

    if (!token) {
      this.errorMessage = 'Token inválido ou expirado.';
      return;
    }

    this.authService.resetPassword(token, password).subscribe({
      next: () => {
        this.successMessage =
          'Sua senha foi redefinida com sucesso.';
        this.resetForm.reset();
      },
      error: () => {
        this.errorMessage =
          'Não foi possível redefinir sua senha.';
      }
    });
  }
}
