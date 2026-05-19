import { Component, inject, signal, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CustomButton } from '../../shared/components/custom-button/custom-button';
import { CardCursoHome } from '../../shared/components/card-curso-home/card-curso-home';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Auth } from '../../services/auth';
import { User as UserService } from '../../services/user';

@Component({
  selector: 'app-profile',
  imports: [FormsModule, ReactiveFormsModule, CommonModule, CustomButton, CardCursoHome],
  templateUrl: './profile.html',
  styleUrl: './profile.css',
})
export class Profile implements OnInit {
  private router = inject(Router);
  private authService = inject(Auth);
  private userService = inject(UserService);
  private cdr = inject(ChangeDetectorRef);
  private fb = inject(FormBuilder);

  isEditing = signal(false);
  enviando = signal(false);
  mensagem = signal('');
  editandoAvatar = signal(false);
  avatarPreviewValida = signal(false);
  avatarUrlInput = '';

  profileForm: FormGroup = this.fb.group({
    nome: [{ value: '', disabled: true }, [Validators.required, Validators.minLength(10)]],
    email: [{ value: '', disabled: true }, [Validators.required, Validators.minLength(10), Validators.email]],
    senha: [{ value: '', disabled: true }, [Validators.minLength(6)]],
    confirmacaoSenha: [{ value: '', disabled: true }, [Validators.minLength(6)]],
  });

  avatarUrl = '';
  role = '';

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
          this.avatarUrl = user.avatar_url || 'assets/GenericAvatar.png';;
          this.role = user.role == 'aluno' ?'Aluno' : 'Professor';

          this.profileForm.enable();

          this.profileForm.patchValue({
            nome: user.full_name || user.name || '',
            email: user.email || '',
          });

          if (!this.isEditing()) {
            this.profileForm.disable();
          }

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
      this.avatarUrlInput = this.avatarUrl !== 'assets/GenericAvatar.png' ? this.avatarUrl : '';
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
        this.avatarUrl = user.avatar_url || this.avatarUrlInput.trim();
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
    const editing = !this.isEditing();
    this.isEditing.set(editing);
    this.editandoAvatar.set(false);

    if (editing) {
      this.profileForm.enable();
    } else {
      this.profileForm.disable();
      this.loadUserData(); // Reseta se cancelado
    }
  }

  onSubmit() {
    if (this.profileForm.invalid) {
      this.profileForm.markAllAsTouched();
      this.mensagem.set("Preencha todos os campos corretamente.");
      return;
    }

    const formValues = this.profileForm.getRawValue();

    // TODO: Validação de senha quando a API suportar
    // if (formValues.senha && formValues.senha !== formValues.confirmacaoSenha) {
    //   this.mensagem.set("As senhas não coincidem.");
    //   return;
    // }

    this.enviando.set(true);

    // A API espera: email, role, full_name, avatar_url
    const payload: any = {
      full_name: formValues.nome,
      email: formValues.email,
      role: this.role,
      avatar_url: this.avatarUrl !== 'assets/GenericAvatar.png' ? this.avatarUrl : ''
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
        this.profileForm.disable();

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

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
