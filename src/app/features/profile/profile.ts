import { Component, inject, signal, OnInit, ChangeDetectorRef } from '@angular/core';
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
  private cdr = inject(ChangeDetectorRef);

  isEditing = signal(false);
  enviando = signal(false);
  mensagem = signal('');
  editandoAvatar = signal(false);
  avatarPreviewValida = signal(false);
  avatarUrlInput = '';

  userData = {
    nome: '',
    email: '',
    senha: '',
    confirmacaoSenha: '',
    role: '',
    avatar_url: ''
  };

  private loadedUser: any = null;

  ngOnInit() {
    this.loadUserData();
  }

  loadUserData() {
    this.userService.getProfile().subscribe({
      next: (response: any) => {
        const user = response.user ? response.user : response;

        if (user) {
          this.loadedUser = user;
          this.userData = {
            ...this.userData,
            nome: user.full_name || user.name || '',
            email: user.email || '',
            role: user.role || '',
            avatar_url: user.avatar_url || 'assets/GenericAvatar.png'
          };
          this.cdr.detectChanges();
        }
      },
      error: (err) => {
        console.error('Erro ao carregar perfil:', err);
        this.mensagem.set('Erro ao carregar dados do perfil.');
      }
    });
  }

  toggleAvatarEdit() {
    this.editandoAvatar.set(!this.editandoAvatar());
    if (this.editandoAvatar()) {
      this.avatarUrlInput = this.userData.avatar_url !== 'assets/GenericAvatar.png' ? this.userData.avatar_url : '';
      this.avatarPreviewValida.set(false);
    }
  }

  onAvatarPreviewLoad() {
    this.avatarPreviewValida.set(true);
  }

  onAvatarPreviewError() {
    this.avatarPreviewValida.set(false);
  }

  salvarAvatar() {
    if (!this.avatarUrlInput.trim()) {
      this.mensagem.set('Informe uma URL válida para a foto.');
      return;
    }

    this.enviando.set(true);
    this.userService.updateProfile({ avatar_url: this.avatarUrlInput.trim() }).subscribe({
      next: (response: any) => {
        const user = response.user ? response.user : response;
        this.userData = {
          ...this.userData,
          avatar_url: user.avatar_url || this.avatarUrlInput.trim()
        };
        this.loadedUser = user;
        this.editandoAvatar.set(false);
        this.enviando.set(false);
        this.mensagem.set('Foto de perfil atualizada!');
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Erro ao atualizar avatar:', err);
        this.mensagem.set('Erro ao atualizar foto de perfil.');
        this.enviando.set(false);
      }
    });
  }

  toggleEdit() {
    this.isEditing.set(!this.isEditing());
    this.editandoAvatar.set(false);
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

    // A API espera: email, role, full_name, avatar_url
    const payload: any = {
      full_name: this.userData.nome,
      email: this.userData.email,
      role: this.userData.role,
      avatar_url: this.userData.avatar_url !== 'assets/GenericAvatar.png' ? this.userData.avatar_url : ''
    };

    console.log('Payload enviado:', payload);

    this.userService.updateProfile(payload).subscribe({
      next: (response: any) => {
        if (response && response.message) {
          this.mensagem.set(response.message);
        } else {
          this.mensagem.set('Perfil atualizado com sucesso!');
        }

        this.enviando.set(false);
        this.isEditing.set(false);

        if (response && response.user) {
          this.loadedUser = response.user;
        }

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
