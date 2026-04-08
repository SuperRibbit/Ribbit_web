import { Component, inject, signal, OnInit } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { CustomButton } from '../../shared/components/custom-button/custom-button';
import { CardCursoHome } from '../../shared/components/card-curso-home/card-curso-home';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Auth } from '../../services/auth';
import { User as UserService } from '../../services/user';

@Component({
  selector: 'app-profile',
  imports: [FormsModule, CommonModule, CustomButton, CardCursoHome],
  templateUrl: './profile.html',
  styleUrl: './profile.css',
})
export class Profile implements OnInit {
  private router = inject(Router);
  private authService = inject(Auth);
  private userService = inject(UserService);

  isEditing = signal(false);
  enviando = signal(false);
  mensagem = signal('');

  userData = {
    nome: '',
    email: '',
    senha: '',
    confirmacaoSenha: '',
    role: '',
    avatar_url: ''
  };

  ngOnInit() {
    this.loadUserData();
  }

  loadUserData() {
    const user = this.authService.getUserData();
    if (user) {
      this.userData.nome = user.full_name || user.name || '';
      this.userData.email = user.email || '';
      this.userData.role = user.role || '';
      this.userData.avatar_url = user.avatar_url || 'assets/GenericAvatar.png';
    }
  }

  toggleEdit() {
    /*// Bloqueia a edição se o usuário for aluno (RN temporária)
    if (this.userData.role === 'aluno') {
      this.mensagem.set('Alunos não podem editar o perfil no momento.');
      return;
    }*/

    this.isEditing.set(!this.isEditing());
    if (!this.isEditing()) {
      this.loadUserData(); // Reseta se cancelado
    }
  }

  onSubmit(form: NgForm) {
    if (form.invalid) {
      this.mensagem.set("Preencha todos os campos corretamente.");
      return;
    }

    if (this.userData.senha && this.userData.senha !== this.userData.confirmacaoSenha) {
      this.mensagem.set("As senhas não coincidem.");
      return;
    }

    this.enviando.set(true);

    const payload: any = {};
    const localUser = this.authService.getUserData();

    if (localUser) {
      const currentName = localUser.full_name || localUser.name;
      if (this.userData.nome && this.userData.nome !== currentName) {
        payload.full_name = this.userData.nome;
      }

      if (this.userData.email && this.userData.email !== localUser.email) {
        payload.email = this.userData.email;
      }

      if (this.userData.avatar_url && this.userData.avatar_url !== localUser.avatar_url && this.userData.avatar_url !== 'assets/GenericAvatar.png') {
        payload.avatar_url = this.userData.avatar_url;
      }
    } else {
      if (this.userData.nome) payload.full_name = this.userData.nome;
      if (this.userData.email) payload.email = this.userData.email;
    }

    if (this.userData.senha) {
      payload.password = this.userData.senha;
    }

    // Se nenhum campo foi alterado, nem tentamos chamar a API
    if (Object.keys(payload).length === 0) {
      this.mensagem.set("Nenhum dado foi alterado.");
      this.enviando.set(false);
      this.isEditing.set(false);
      return;
    }

    this.userService.updateProfile(payload).subscribe({
      next: (response: any) => {
        if (response && response.message) {
          this.mensagem.set(response.message);
        } else {
          this.mensagem.set('Perfil atualizado com sucesso!');
        }

        this.enviando.set(false);
        this.isEditing.set(false);

        // Atualizar localStorage com os novos dados
        if (typeof localStorage !== 'undefined' && response && response.user) {
          const user = response.user;
          const updatedUser = {
            id: user.user_uuid,
            name: user.full_name,
            ...user
          };
          localStorage.setItem('user_data', JSON.stringify(updatedUser));
        }
      },
      error: (err) => {
        console.error('Erro ao atualizar perfil', err);
        this.mensagem.set('Erro ao atualizar perfil. Tente novamente.');
        this.enviando.set(false);
      }
    });
  }
}
