import { Component, HostListener, OnInit, inject, signal } from '@angular/core';
import { CustomButton } from "../../shared/components/custom-button/custom-button";
import { NavigationEnd, Router, RouterLink } from "@angular/router";
import { Auth } from '../../services/auth';
import { filter } from 'rxjs';

@Component({
  selector: 'app-navbar',
  imports: [CustomButton, RouterLink],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar implements OnInit {
  private auth = inject(Auth);
  private router = inject(Router);

  avatarUrl = this.auth.avatarUrl;
  isAdmin = this.auth.isAdmin;
  isPublicRoute = false;
  showAdminMenu = signal(false);

  toggleAdminMenu() {
    this.showAdminMenu.update(open => !open);
  }

  closeAdminMenu() {
    this.showAdminMenu.set(false);
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    const target = event.target as HTMLElement | null;

    if (this.showAdminMenu() && !target?.closest('.admin-dropdown')) {
      this.closeAdminMenu();
    }
  }

  @HostListener('document:keydown.escape')
  onEscapePressed(): void {
    if (this.showAdminMenu()) {
      this.closeAdminMenu();
    }
  }

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
    this.auth.syncAdminFromStorage();
  }
}