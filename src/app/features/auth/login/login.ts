import { Component, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, NgForm, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { CustomButton } from '../../../shared/components/custom-button/custom-button';
import { Auth } from '../../../services/auth';

@Component({
  selector: 'app-login',
  imports: [CommonModule, FormsModule, CustomButton, ReactiveFormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: '../auth.css'
})
export class Login {
  errorMessage = signal<string | null>(null);
  loading = signal(false);
  loginForm: FormGroup

  constructor( private fb: FormBuilder, private authService: Auth, private router: Router ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  get f() { return this.loginForm.controls; }

  onLogin() {
    if (this.loginForm.invalid) {
      this.errorMessage.set('Por favor, preencha os campos corretamente.');
      return
    }

    this.errorMessage.set(null);
    this.loading.set(true);

    this.authService.login(this.loginForm.value).subscribe({
      next: (response) => {
        console.log('Login feito com sucesso!', response)
        this.loading.set(false);
        this.router.navigate(['/home'])
      },
      error: (err) => {
        console.error('Erro no login', err)
        if (err.error && err.error.message) {
          this.errorMessage.set(err.error.message);
        } else {
          this.errorMessage.set('Não foi possível conectar ao servidor.');
        }
        this.loading.set(false);
      }
    });
  }
}
