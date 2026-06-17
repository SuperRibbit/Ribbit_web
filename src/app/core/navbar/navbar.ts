import { Component, OnInit, inject } from '@angular/core';
import { CustomButton } from "../../shared/components/custom-button/custom-button";
import { NavigationEnd, Router, RouterLink } from "@angular/router";
import { Auth } from '../../services/auth';
import { User as UserService } from '../../services/user';
import { filter } from 'rxjs';

@Component({
  selector: 'app-navbar',
  imports: [CustomButton, RouterLink],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar implements OnInit {
  private auth = inject(Auth);
  private userService = inject(UserService);
  private router = inject(Router);

  avatarUrl = this.auth.avatarUrl;
  isPublicRoute = false;

  get isLogged() {
    return this.auth.isLoggedIn();
  }

  get showPublic() {
    return this.isPublicRoute || !this.isLogged;
  }

  private updatePublicRoute() {
    const rotaAtual = this.router.routerState.root.firstChild;
    this.isPublicRoute = rotaAtual?.snapshot.data['publicRoute'] ?? false;
  }

  constructor() {
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => this.updatePublicRoute());
  }

  ngOnInit() {
    this.updatePublicRoute();

    if (this.isLogged && !this.isPublicRoute) {
      this.loadUserAvatar();
    }
  }

  loadUserAvatar() {
    this.userService.getProfile().subscribe({
      error: (err) => {
        console.error('Erro ao carregar avatar na navbar:', err);
      }
    });
  }
}
