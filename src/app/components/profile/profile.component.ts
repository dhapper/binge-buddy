import { Component, OnInit } from '@angular/core';
import { NavbarComponent } from "../navbar/navbar.component";
import { AuthService } from '../../services/auth.service';
import { FirestoreDatabase } from '../../services/firestore-database.service';
import { CommonModule } from '@angular/common';
import { TvmazeService } from '../../services/tvmaze.service';
import { Show } from '../../models/show';
import { ListComponent } from "../list/list.component";
import { AppConstants } from '../../constants/app.constants';

@Component({
  selector: 'app-profile',
  imports: [NavbarComponent, CommonModule, ListComponent],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent implements OnInit {
  public AppConstants = AppConstants;

  watchlist: Show[] = [];
  history: Show[] = [];
  firstList: boolean = true;

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
  
  toggleList() {
    this.firstList = !this.firstList;
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
