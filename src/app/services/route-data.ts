import { Injectable, inject, signal } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class RouteData {
  private router = inject(Router);

  readonly hideNavbar = signal(false);
  readonly isPublicRoute = signal(false);

  constructor() {
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => this.update());

    this.update();
  }

  private update(): void {
    const snapshot = this.router.routerState.root.firstChild?.snapshot;

    this.hideNavbar.set(snapshot?.data['hideNavbar'] ?? false);
    this.isPublicRoute.set(snapshot?.data['publicRoute'] ?? false);
  }
}
