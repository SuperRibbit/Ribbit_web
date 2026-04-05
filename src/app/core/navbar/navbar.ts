import { Component } from '@angular/core';
import { CustomButton } from "../../shared/components/custom-button/custom-button";
import { RouterLink } from "@angular/router";
import { Auth } from '../../services/auth';

@Component({
  selector: 'app-navbar',
  imports: [CustomButton, RouterLink],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar {
  constructor(private auth: Auth) {}

  get isLogged() {
    return this.auth.isLoggedIn()
  }
}
