import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Show } from '../../models/show';
import { ShowCardComponent } from '../show-card/show-card.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-list',
  imports: [ShowCardComponent, CommonModule],
  templateUrl: './list.component.html',
  styleUrl: './list.component.css',
  standalone: true
})
export class ListComponent {
  @Input() list: Show[] = [];
  @Input() category: string = '';
  @Input() title: string = 'place_holder_text';
  @Output() onDelete = new EventEmitter<number>();

  delete(showID: number) {
    this.onDelete.emit(showID);
  }
}
