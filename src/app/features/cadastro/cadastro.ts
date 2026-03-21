import { Component, inject, signal } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { CadastroService } from './service/cadastro.service';
import { cadastroUsuario } from '../../model/cadastroUsuario';
import { CustomButton } from '../../shared/components/custom-button/custom-button';

@Component({
  selector: 'app-cadastro',
  imports: [FormsModule, NgForm, CommonModule, Router, CustomButton],
  templateUrl: './cadastro.html',
  styleUrl: './cadastro.css',
})
export class Cadastro {
  private router = inject(Router);
  private loginService = inject(CadastroService)

  userLogin: cadastroUsuario = {
    nome: '',
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

