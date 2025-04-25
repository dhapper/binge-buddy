import { Component, OnInit } from '@angular/core';
import { Show } from '../../models/show';
import { TvmazeService } from '../../services/tvmaze.service';
import { ShowCardComponent } from "../show-card/show-card.component";
import { CommonModule } from '@angular/common';
import { FirestoreDatabase } from '../../services/firestore-database.service';
import { AuthService } from '../../services/auth.service';
import { NavbarComponent } from "../navbar/navbar.component";

@Component({
  selector: 'app-recommended',
  imports: [NavbarComponent, CommonModule, ShowCardComponent],
  templateUrl: './recommended.component.html',
  styleUrl: './recommended.component.css'
})
export class RecommendedComponent {

  shows: Show[] = [];

  constructor(
    private tvmazeService: TvmazeService,
    private firestoreDatabase: FirestoreDatabase,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    const userID = this.authService.currentUser?.uid;

    if (userID) {
      const history = this.firestoreDatabase.getLocalHistory(userID);

      if (history && history.length > 0) {
        this.tvmazeService.getRecommendedShows(history).subscribe(
          (recommendedShows) => {
            this.shows = recommendedShows;
          },
          (error) => {
            console.error('Error fetching recommended shows:', error);
          }
        );
      } else {
        console.log('No watch history found to generate recommendations.');
      }
    } else {
      console.error('User not logged in.');
    }
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
