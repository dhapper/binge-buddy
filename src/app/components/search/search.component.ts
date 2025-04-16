import { Component } from '@angular/core';
import { NavbarComponent } from "../navbar/navbar.component";
import { TvmazeService } from '../../services/tvmaze.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Show } from '../../models/show';
import { ShowCardComponent } from "../show-card/show-card.component";
import { FirestoreDatabase } from '../../services/firestore-database.service';
import { AuthService } from '../../services/auth.service';

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

          // this.shows.forEach(show => {
          //   console.log(`ID: ${show.id}, Name: ${show.name}`);
          // });
        },
        (error) => {
          console.error('Error fetching shows:', error);
        }
      );
    }
    this.lastSearchTerm = this.searchTerm
  }

  addToWatchList(showID: number): void {
    // console.log(showID);

    const userID = this.authService.currentUser?.uid!;

    this.firestoreDatabase.addToWatchList(userID, showID)
      .then(() => {
        console.log(`Successfully added show ${showID} to watch-list.`);
      })
      .catch(error => {
        console.error("Failed to add show to watch-list:", error);
      });
  }

}
