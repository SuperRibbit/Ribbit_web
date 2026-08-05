import { Component, inject, signal, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CustomButton } from '../../shared/components/custom-button/custom-button';
import { CardCursoHome } from '../../shared/components/card-curso-home/card-curso-home';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { Auth } from '../../services/auth';
import { User as UserService } from '../../services/user';
import { EnrollmentsService } from '../../services/enrollments_service';
import { ModalAvatar } from "../../shared/components/modal-avatar/modal-avatar";

@Component({
  selector: 'app-profile',
  imports: [FormsModule, ReactiveFormsModule, CommonModule, CustomButton, CardCursoHome, RouterLink, ModalAvatar],
  templateUrl: './profile.html',
  styleUrl: './profile.css',
})
export class Profile implements OnInit {
  private router = inject(Router);
  private authService = inject(Auth);
  private userService = inject(UserService);
  private enrollmentsService = inject(EnrollmentsService);
  private cdr = inject(ChangeDetectorRef);
  private fb = inject(FormBuilder);

  enviando = signal(false);
  mensagem = signal('');
  editandoAvatar = signal(false);
  avatarPreviewValida = signal(false);
  avatarUrlInput = '';

  listaMeusCursos = signal<any[]>([]);

  profileForm: FormGroup = this.fb.group({
    nome: ['', [Validators.required, Validators.minLength(10)]],
    email: ['', [Validators.required, Validators.minLength(10), Validators.email]],
  });

  avatarUrl = '';
  role = '';

  private loadedUser: any = null;

  ngOnInit() {
    this.loadUserData();
    this.loadUserCourses();
  }

  loadUserCourses() {
    this.enrollmentsService.getMyCourses().subscribe({
      next: (response: any) => {
        if (response && response.courses) {
          this.listaMeusCursos.set(response.courses);
        }
      },
      error: (err) => {
        console.error('Erro ao buscar cursos do perfil:', err);
      }
    });
  }

  formSemAlteracoes(): boolean {
    if (this.profileForm.invalid) return true;

    const formModificado = this.profileForm.dirty;
    const avatarOriginal = this.loadedUser?.avatar_url || 'assets/GenericAvatar.png';
    const avatarModificado = this.avatarUrl !== avatarOriginal;
    return !formModificado && !avatarModificado;
  }

  loadUserData() {
    this.userService.getProfile().subscribe({
      next: (response: any) => {
        const user = response.user ? response.user : response;

        if (user) {
          this.loadedUser = user;
          this.avatarUrl = user.avatar_url || 'assets/GenericAvatar.png';
          this.role = user.role == 'aluno' ? 'Aluno' : 'Professor';

          this.profileForm.patchValue({
            nome: user.full_name || user.name || '',
            email: user.email || ''
          });

          this.profileForm.markAsPristine();
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

  onSubmit() {
    if (this.profileForm.invalid) {
      this.profileForm.markAllAsTouched();
      this.mensagem.set("Preencha todos os campos corretamente.");
      return;
    }

    const formValues = this.profileForm.getRawValue();
    this.enviando.set(true);

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

        if (response && response.user) {
          this.loadedUser = response.user;
        }

        if (typeof localStorage !== 'undefined' && response && response.user) {
          const user = response.user;
          const updatedUser = {
            id: user.user_uuid,
            name: user.full_name,
            ...user
          };
          localStorage.setItem('user_data', JSON.stringify(updatedUser));
        }
        
        this.profileForm.markAsPristine();
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