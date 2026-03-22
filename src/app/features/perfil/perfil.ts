import { Component, inject, signal } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { CustomButton } from '../../shared/components/custom-button/custom-button';
import { CardCursoHome } from '../../shared/components/card-curso-home/card-curso-home';

import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { PerfilService } from './service/perfil.service';
import { perfilUsuario } from '../../model/perfilUsuario';

@Component({
  selector: 'app-perfil',
  imports:[FormsModule, CommonModule, CustomButton, CardCursoHome],
  templateUrl: './perfil.html',
  styleUrl: './perfil.css',
})
export class Perfil {private router = inject(Router);

  private perfilService = inject(PerfilService);

  userPerfil: perfilUsuario = {
    nome: '',
    email: '',
    senha: '',
    confirmacaoSenha: '',
    avatarUrl: ''
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
      this.mensagem.set('Alteração simulada com sucesso!');
      this.enviando.set(false);
      this.router.navigate(['/']);
    }, 1000);
  }
}
