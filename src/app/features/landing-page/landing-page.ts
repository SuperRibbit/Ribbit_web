import { Component, inject } from '@angular/core';
import { Footer } from "../../core/footer/footer";
import { CustomButton } from "../../shared/components/custom-button/custom-button";
import { RouterLink } from "@angular/router";
import { Auth } from '../../services/auth';

@Component({
  selector: 'app-landing-page',
  imports: [Footer, CustomButton, RouterLink],
  templateUrl: './landing-page.html',
  styleUrl: './landing-page.css',
})
export class LandingPage {
  private auth = inject(Auth);

  get isLogged() {
    return this.auth.isLoggedIn();
  }
}
