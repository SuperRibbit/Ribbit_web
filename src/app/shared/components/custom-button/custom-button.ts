import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-custom-button',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './custom-button.html',
  styleUrl: './custom-button.css',
})
export class CustomButton {
  @Input() variant: 'yellow' | 'green' | 'white' | 'blue' | 'light-blue' | 'red' = 'blue';
  @Input() label: string = 'BUTTON';
  @Input() disabled: boolean = false;
}
