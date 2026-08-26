import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-pagination',
  imports: [CommonModule],
  templateUrl: './pagination.html',
  styleUrl: './pagination.css',
})
export class Pagination {
  @Input() page: number = 1;
  @Input() totalPages: number = 1;
  @Output() pageChange = new EventEmitter<number>();

  goToPrevious(): void {
    if (this.page > 1) {
      this.pageChange.emit(this.page - 1);
    }
  }

  goToNext(): void {
    if (this.page < this.totalPages) {
      this.pageChange.emit(this.page + 1);
    }
  }
}