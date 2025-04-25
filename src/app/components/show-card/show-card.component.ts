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
  @Input() isSmall: boolean = false

  getShortSummary(summary: string | null | undefined, wordLimit: number): string {
    if (!summary) {
      return 'No summary available.';
    }

    const words = summary.split(/\s+/);
    return words.length > wordLimit ? words.slice(0, wordLimit).join(' ') + '...' : summary;
  }

  getShortTitle(title: string | null | undefined, charLimit: number): string {
    if (!title) {
      return 'No title available.';
    }

    if (title.length > charLimit) {
      return title.slice(0, charLimit) + '...';
    } else {
      return title;
    }
  }

  formatGenres(genres: string | null | undefined): string {
    if (!genres) {
      return 'No genres available.';
    }

    return genres.replace(/,\s*/g, ', ');
  }

}
