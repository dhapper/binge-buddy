import { Component, OnInit } from '@angular/core';
import { NavbarComponent } from "../navbar/navbar.component";
import { AuthService } from '../../services/auth.service';
import { FirestoreDatabase } from '../../services/firestore-database.service';
import { CommonModule } from '@angular/common';
import { TvmazeService } from '../../services/tvmaze.service';
import { Show } from '../../models/show';
import { ListComponent } from "../list/list.component";
import { AppConstants } from '../../constants/app.constants';
import { ThemeService } from '../../services/theme.service';

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
  username: string = 'placeholder_username_1';

  constructor(
    private firestoreDatabase: FirestoreDatabase,
    private authService: AuthService,
    private tvmazeService: TvmazeService,
    private theme: ThemeService
  ) { }

  ngOnInit(): void {
    const userID = this.authService.currentUser?.uid;

    if (userID) {
      this.watchlist = this.firestoreDatabase.getLocalWatchList(userID);
      this.history = this.firestoreDatabase.getLocalHistory(userID);
    }

    this.username = this.authService.currentUser?.email ?? "placeholder_username_2";
    this.username = this.extractUsername(this.username);

  }

  extractUsername(input: string): string {
    const atIndex = input.indexOf('@');
    return atIndex === -1 ? input : input.substring(0, atIndex);
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

  onThemeToggle(event: Event): void {
    this.theme.toggleTheme();
  }


}
