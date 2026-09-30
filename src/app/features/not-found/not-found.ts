import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CustomButton } from '../../shared/components/custom-button/custom-button';

@Component({
  selector: 'app-not-found',
  imports: [RouterLink, CustomButton],
  templateUrl: './not-found.html',
  styleUrl: './not-found.css',
})
export class NotFound {}
