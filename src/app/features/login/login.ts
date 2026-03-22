import { Component, inject, signal } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { Router } from '@angular/router';
import { LoginService } from './service/login.service';
import { loginUsuario } from '../../model/loginUsuario';
import { CustomButton } from '../../shared/components/custom-button/custom-button';

@Component({
  selector: 'app-login',
  imports: [CommonModule, FormsModule, CustomButton],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {

  private router = inject(Router);
  private loginService = inject(LoginService)

  userLogin: loginUsuario = {
    email: '',
    senha: ''
  };

  enviando = signal(false);
  mensagem = signal('');
  onSubmit(form: NgForm) {
    if (form.invalid) {
      this.mensagem.set("Preencha todos os campos.");
      return;
    }

    this.enviando.set(true);

    setTimeout(() => {
      this.mensagem.set('Login simulado com sucesso!');
      this.enviando.set(false);
      this.router.navigate(['/']);
    }, 1000);
  }
}
