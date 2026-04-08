import { Component } from '@angular/core';
import { CardCursoHome } from "../../shared/components/card-curso-home/card-curso-home";
import { CardCursoDashboard } from "../../shared/components/card-curso-dashboard/card-curso-dashboard";
import { Footer } from "../../core/footer/footer";

@Component({
  selector: 'app-home',
  imports: [CardCursoHome, CardCursoDashboard, Footer],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {}
