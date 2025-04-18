import { Component } from '@angular/core';
import { NavbarComponent } from "../navbar/navbar.component";
import { TvmazeService } from '../../services/tvmaze.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Show } from '../../models/show';
import { ShowCardComponent } from "../show-card/show-card.component";
import { FirestoreDatabase } from '../../services/firestore-database.service';
import { AuthService } from '../../services/auth.service';
import { AppConstants } from '../../constants/app.constants';

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

  constructor(
    private tvmazeService: TvmazeService,
    private firestoreDatabase: FirestoreDatabase,
    private authService: AuthService
  ) { }

  performSearch(): void {

    if (this.searchTerm) {
      this.tvmazeService.getShows(this.searchTerm).subscribe(
        (data: any) => {
          this.shows = data.map((item: any) => item.show);
        },
        (error) => {
          console.error('Error fetching shows:', error);
        }
      );
    }
    this.lastSearchTerm = this.searchTerm
  }

  addToDatabase(showID: number, category: string) {
    const userID = this.authService.currentUser?.uid!;

    this.firestoreDatabase.addToDatabase(userID, showID, category)
      .then(() => {
        console.log(`Successfully added show ${showID} to ${category}.`);
      })
      .catch(error => {
        console.error(`Failed to add show to ${category}:`, error);
      });
  }

}
