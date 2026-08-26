import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { User as UserService } from '../../../services/user';

interface AdminUser {
  user_uuid: string;
  full_name: string;
  name?: string;
  email: string;
  role: string;
  avatar_url?: string;
  created_at?: string;
}

@Component({
  selector: 'app-admin-users',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './admin-users.html',
  styleUrls: ['./admin-users.css']
})
export class AdminUsers implements OnInit {
  private userService = inject(UserService);
  private router = inject(Router);
  private cdr = inject(ChangeDetectorRef);

  searchTerm = '';
  users: AdminUser[] = [];
  isLoading = true;
  errorMessage = '';

  showUserModal = false;
  selectedUser: AdminUser | null = null;

  ngOnInit(): void {
    this.verifyAdmin();
  }

  verifyAdmin(): void {
    this.isLoading = true;

    this.userService.getProfile().subscribe({
      next: (response: any) => {
        const user = response?.user ? response.user : response;

        if (!user || user.role !== 'admin') {
          this.router.navigate(['/home']);
          return;
        }

        this.fetchUsers();
      },
      error: (err) => {
        console.error('Erro ao verificar permissão de admin:', err);
        this.router.navigate(['/home']);
      }
    });
  }

  fetchUsers(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.userService.getUsers().subscribe({
      next: (response: any) => {
        const rawUsers = Array.isArray(response) ? response : (response?.users || []);

        this.users = rawUsers.map((u: any) => ({
          ...u,
          user_uuid: u.user_uuid ?? u.id
        }));

        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Erro ao buscar usuários:', err);
        this.errorMessage = 'Não foi possível carregar os usuários.';
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  get filteredUsers(): AdminUser[] {
    const term = this.searchTerm?.trim().toLowerCase() || '';

    const filtered = this.users.filter(user =>
      !term ||
      (user.full_name && user.full_name.toLowerCase().includes(term)) ||
      (user.email && user.email.toLowerCase().includes(term)) ||
      (user.role && user.role.toLowerCase().includes(term))
    );

    return [...filtered].sort((a, b) =>
      (a.full_name || a.name || '').localeCompare(b.full_name || b.name || '')
    );
  }

  openUserModal(user: AdminUser): void {
    this.selectedUser = user;
    this.showUserModal = true;
  }

  closeUserModal(): void {
    this.showUserModal = false;
    this.selectedUser = null;
  }

  getRoleLabel(role: string): string {
    const roles: Record<string, string> = {
      admin: 'Admin',
      prof: 'Professor',
      aluno: 'Aluno',
    };
    return roles[role] || role;
  }

  formatDate(date: string | undefined): string {
    if (!date) return '-';

    const parsed = new Date(date);
    if (isNaN(parsed.getTime())) return '-';

    return parsed.toLocaleDateString('pt-BR');
  }
}