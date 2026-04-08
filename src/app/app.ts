import { Component, signal } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { Navbar } from './core/navbar/navbar';
import { filter } from 'rxjs';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Navbar],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {

  protected readonly title = signal('Ribbit_web');

  hideNavbar = false;

  constructor(private router: Router) {
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        const rotaAtual = this.router.routerState.root.firstChild;
        this.hideNavbar = rotaAtual?.snapshot.data['hideNavbar'] ?? false;
      });
  }
}