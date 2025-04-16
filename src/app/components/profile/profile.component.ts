import { Component, OnInit } from '@angular/core';
import { NavbarComponent } from "../navbar/navbar.component";
import { AuthService } from '../../services/auth.service';
import { FirestoreDatabase } from '../../services/firestore-database.service';
import { CommonModule } from '@angular/common';
import { TvmazeService } from '../../services/tvmaze.service';
import { Show } from '../../models/show';

@Component({
  selector: 'app-profile',
  imports: [NavbarComponent, CommonModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent implements OnInit{
  watchlist: Show[] = [];
  
  constructor(
    private firestoreDatabase: FirestoreDatabase,
    private authService: AuthService,
    private tvmazeService: TvmazeService
  ) {}

  ngOnInit(): void {
    const userID = this.authService.currentUser?.uid;

    if (userID) {
      this.loadWatchlist(userID);
    }
  }

  // private initShows(): void {
  //   for(id in this.watchlist){
  //     //add to shows
  //     this.tvmazeService.getShowById(id);
  //   }
  // }

  private loadWatchlist(userID: string): void {
    this.firestoreDatabase.loadWatchList(userID)
      .then(() => {
        this.watchlist = this.firestoreDatabase.getLocalWatchList(userID);
        console.log(this.watchlist); // Log the watchlist to check its contents
      })
      .catch(error => {
        console.error('Error loading watchlist:', error);
      });
}

  // private loadWatchlist(userID: string): void {
  //   this.firestoreDatabase.loadWatchList(userID)
  //     .then(() => {
  //       this.watchlist = this.firestoreDatabase.getLocalWatchList(userID);
  //     })
  //     .catch(error => {
  //       console.error('Error loading watchlist:', error);
  //     });
  // }

}
