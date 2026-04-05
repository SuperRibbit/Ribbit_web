import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CustomButton } from '../../shared/components/custom-button/custom-button';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Auth } from '../../services/auth';

@Component({
  selector: 'app-cadastro',
  imports: [FormsModule, CommonModule, CustomButton, ReactiveFormsModule],
  templateUrl: './cadastro.html',
  styleUrl: '../login/login.css',
})
export class Cadastro {
  registerForm: FormGroup

  constructor( private fb: FormBuilder, private authService: Auth, private router: Router ) {
    this.registerForm = this.fb.group({
      full_name: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]],
      role: ['aluno'], //por padrão usuário será aluno
      avatar_url: [''] //sem foto 
    });
  }

  get f() { return this.registerForm.controls; }

  onRegister() {
    if (this.registerForm.invalid) {
      alert('Preencha todos os campos corretamente.')
      return
    }

    const { full_name, email, password, confirmPassword, role, avatar_url } = this.registerForm.value

    if (password !== confirmPassword) {
      alert('As senhas não coincidem!')
      return;
    }

    const userToSend = { full_name, email, password, role, avatar_url };

    this.authService.register(userToSend).subscribe({
      next: (response) => {
        console.log('Usuário criado!', response)
        alert('Conta criada com sucesso!')
        this.router.navigate(['/home'])
        this.registerForm.reset()
      },
      error: (err) => {
        console.error('Erro ao criar conta', err)
        alert('Erro ao criar conta.')
      }
    })
  }
}

