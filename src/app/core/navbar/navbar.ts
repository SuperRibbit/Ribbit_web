import { Component, OnInit, inject, signal } from '@angular/core';
import { CustomButton } from "../../shared/components/custom-button/custom-button";
import { RouterLink } from "@angular/router";
import { Auth } from '../../services/auth';
import { User as UserService } from '../../services/user';

@Component({
  selector: 'app-navbar',
  imports: [CustomButton, RouterLink],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar implements OnInit {
  private auth = inject(Auth);
  private userService = inject(UserService);

  avatarUrl = signal<string>('assets/GenericAvatar.png');

  get isLogged() {
    return this.auth.isLoggedIn();
  }

  ngOnInit() {
    if (this.isLogged) {
      this.loadUserAvatar();
    }
  }

  loadUserAvatar() {
    this.userService.getProfile().subscribe({
      next: (response: any) => {
        const user = response.user ? response.user : response;
        if (user && user.avatar_url) {
          this.avatarUrl.set(user.avatar_url);
        }
      },
      error: (err) => {
        console.error('Erro ao carregar avatar na navbar:', err);
      }
    });
  }
}
