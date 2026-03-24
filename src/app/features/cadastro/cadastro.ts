import { Component, inject, signal } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { CustomButton } from '../../shared/components/custom-button/custom-button';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { CadastroService } from './service/cadastro.service';
import { cadastroUsuario } from '../../model/cadastroUsuario';

@Component({
  selector: 'app-cadastro',
  imports: [FormsModule, CommonModule, CustomButton],
  templateUrl: './cadastro.html',
  styleUrl: '../login/login.css',
})
export class Cadastro {
  private router = inject(Router);
  private cadastroService = inject(CadastroService);

  userCadastro: cadastroUsuario = {
    nome: '',
    email: '',
    senha: '',
    confirmacaoSenha: ''
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
      this.mensagem.set('Cadastro simulado com sucesso!');
      this.enviando.set(false);
      this.router.navigate(['/']);
    }, 1000);
  }
}

