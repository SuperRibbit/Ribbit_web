import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-modules',
  imports: [],
  templateUrl: './modules.html',
  styleUrl: './modules.css',
})
export class Modules {
  @Input() modules: any[] = [];
}
