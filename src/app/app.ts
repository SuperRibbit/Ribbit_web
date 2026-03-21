import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Navbar } from './core/navbar/navbar';
import { CardCursoDashboard } from './shared/components/card-curso-dashboard/card-curso-dashboard';
import { Cadastro } from './features/cadastro/cadastro';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Navbar, CardCursoDashboard, Cadastro],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('Ribbit_web');
}
