import { Component } from '@angular/core';
import { Footer } from "../../core/footer/footer";
import { CustomButton } from "../../shared/components/custom-button/custom-button";
import { RouterLink } from "@angular/router";

@Component({
  selector: 'app-landing-page',
  imports: [Footer, CustomButton, RouterLink],
  templateUrl: './landing-page.html',
  styleUrl: './landing-page.css',
})
export class LandingPage {}
