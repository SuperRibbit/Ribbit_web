import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CustomButton } from '../custom-button/custom-button';
import { DriveImgPipe } from "../../../utilities/pipes/drive-img-pipe";

@Component({
  selector: 'app-card-curso-dashboard',
  standalone: true,
  imports: [CommonModule, CustomButton, DriveImgPipe],
  templateUrl: './card-curso-dashboard.html',
  styleUrl: './card-curso-dashboard.css',
})

export class CardCursoDashboard{
  @Input() imageUrl: string = 'assets/imageScratch.png';
  @Input() description: string = 'Lorem ipsum dolor sit amet, consectetur.';
  @Input() progress: number = 0;
}
