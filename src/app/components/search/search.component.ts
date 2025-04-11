import { Component } from '@angular/core';
import { NavbarComponent } from "../navbar/navbar.component";
import { TvmazeService } from '../../services/tvmaze.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Show } from '../../models/show';
import { ShowCardComponent } from "../show-card/show-card.component";

@Component({
  selector: 'app-search',
  imports: [NavbarComponent, CommonModule, FormsModule, ShowCardComponent],
  templateUrl: './search.component.html',
  styleUrl: './search.component.css'
  
})
export class SearchComponent {

  searchTerm: string = '';
  lastSearchTerm: string = '';
  shows: Show[] = [];

  constructor(private tvmazeService: TvmazeService) {}

  performSearch(): void {

    if (this.searchTerm) {
      this.lastSearchTerm = this.searchTerm
      this.tvmazeService.getShows(this.searchTerm).subscribe(
        (data: any) => {
          this.shows = data.map((item: any) => item.show);
        },
        (error) => {
          console.error('Error fetching shows:', error);
        }
      );
    }
  }

}
