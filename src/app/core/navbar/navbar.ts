import { Component, HostListener, OnInit, inject, signal } from '@angular/core';
import { CustomButton } from "../../shared/components/custom-button/custom-button";
import { RouterLink } from "@angular/router";
import { Auth } from '../../services/auth';
import { RouteData } from '../../services/route-data';

@Component({
  selector: 'app-navbar',
  imports: [CustomButton, RouterLink],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar implements OnInit {
  private auth = inject(Auth);
  private routeData = inject(RouteData);

  avatarUrl = this.auth.avatarUrl;
  isAdmin = this.auth.isAdmin;
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
    return this.routeData.isPublicRoute() || !this.isLogged;
  }

  ngOnInit() {
    this.auth.syncAdminFromStorage();
  }
}
