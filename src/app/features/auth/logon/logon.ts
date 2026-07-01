import { Component, signal } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CustomButton } from '../../../shared/components/custom-button/custom-button';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { Auth } from '../../../services/auth';

@Component({
  selector: 'app-logon',
  imports: [FormsModule, CommonModule, CustomButton, ReactiveFormsModule, RouterLink],
  templateUrl: './logon.html',
  styleUrl: '../auth.css',
})
export class Logon {
  registerForm: FormGroup
  errorMessage = signal<string | null>(null);
  loading = signal(false);

  constructor( private fb: FormBuilder, private authService: Auth, private router: Router ) {
    this.registerForm = this.fb.group({
      full_name: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]],
      role: ['prof'], //por padrão usuário será aluno
      avatar_url: [''] //sem foto 
    });
  }

  get f() { return this.registerForm.controls; }

  onRegister() {
    if (this.registerForm.invalid) {
      this.errorMessage.set('Preencha todos os campos corretamente.');
      return
    }

    this.errorMessage.set(null);
    this.loading.set(true);

    const { full_name, email, password, confirmPassword, role, avatar_url } = this.registerForm.value

    if (password !== confirmPassword) {
      this.errorMessage.set('As senhas não coincidem!');
      this.loading.set(false);
      return;
    }

    const userToSend = { full_name, email, password, role, avatar_url };

    this.authService.register(userToSend).subscribe({
      next: (response) => {
        console.log('Usuário criado!', response)
        alert('Conta criada com sucesso!')
        this.loading.set(false);
        this.router.navigate(['/home'])
        this.registerForm.reset()
      },
      error: (err) => {
        console.error('Erro ao criar conta', err)
        if (err.error && err.error.message) {
          this.errorMessage.set(err.error.message);
        } else {
          this.errorMessage.set('Não foi possível conectar ao servidor.');
        }
        this.loading.set(false);
      }
    })
  }
}

