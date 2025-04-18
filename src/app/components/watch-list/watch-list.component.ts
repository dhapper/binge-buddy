import { Component, OnInit } from '@angular/core';
import { NavbarComponent } from "../navbar/navbar.component";
import { AuthService } from '../../services/auth.service';
import { FirestoreDatabase } from '../../services/firestore-database.service';
import { CommonModule } from '@angular/common';
import { TvmazeService } from '../../services/tvmaze.service';
import { Show } from '../../models/show';
import { ShowCardComponent } from "../show-card/show-card.component";

@Component({
  selector: 'app-watch-list',
  imports: [],
  templateUrl: './watch-list.component.html',
  styleUrl: './watch-list.component.css'
})
export class WatchListComponent implements OnInit{

  watchlist: Show[] = [];
    history: Show[] = [];
  
    constructor(
      private firestoreDatabase: FirestoreDatabase,
      private authService: AuthService,
      private tvmazeService: TvmazeService
    ) { }
  
    ngOnInit(): void {
      const userID = this.authService.currentUser?.uid;
  
      if (userID) {
        this.watchlist = this.firestoreDatabase.getLocalWatchList(userID);
        this.history = this.firestoreDatabase.getLocalHistory(userID);
      }
    }

  delete(showID: number, category: string) {
    const userID = this.authService.currentUser?.uid!;

    this.firestoreDatabase.deleteFromDatabase(userID, showID, category)
      .then(() => {
        console.log(`Successfully removed show ${showID} to ${category}.`);
        this.history = this.firestoreDatabase.getLocalHistory(userID);
        this.watchlist = this.firestoreDatabase.getLocalWatchList(userID);
      })
      .catch(error => {
        console.error(`Failed to remove show to ${category}:`, error);
      });
  }

}
