import { Component, Input } from '@angular/core';
import { Show } from '../../models/show';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-show-card',
  imports: [CommonModule],
  templateUrl: './show-card.component.html',
  styleUrl: './show-card.component.css'
})
export class ShowCardComponent {
  @Input() show!: Show;

  getShortSummary(summary: string, wordLimit: number): string {
    const words = summary.split(/\s+/);
    return words.length > wordLimit ? words.slice(0, wordLimit).join(' ') + '...' : summary;
  }

}
