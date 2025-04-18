import { Injectable } from '@angular/core';
import { Firestore, doc, getDocs, collection, setDoc, deleteDoc } from '@angular/fire/firestore';
import { TvmazeService } from './tvmaze.service';
import { firstValueFrom } from 'rxjs';
import { Show } from '../models/show';
import { AppConstants } from '../constants/app.constants';

@Injectable({
  providedIn: 'root',
})
export class FirestoreDatabase {
  private watchList: { [key: string]: Show[] } = {};
  private history: { [key: string]: Show[] } = {};

  constructor(
    private firestore: Firestore,
    private tvmazeService: TvmazeService
  ) { }

  /**
   * Watch-list functions
   */

  getLocalWatchList(userID: string): Show[] {
    return this.watchList[userID] || [];
  }

  private updateLocalWatchList(userID: string, show: Show): void {
    if (!this.watchList[userID]) {
      this.watchList[userID] = [];
    }
    const alreadyExists = this.watchList[userID].some(s => s.id === show.id);
    if (!alreadyExists) {
      this.watchList[userID].push(show);
    }
  }

  private removeFromLocalWatchList(userID: string, showID: number): void {
    if (this.watchList[userID]) {
      this.watchList[userID] = this.watchList[userID].filter(s => s.id !== showID);
    }
  }

  /**
   * History Functions
   */

  getLocalHistory(userID: string): Show[] {
    return this.history[userID] || [];
  }

  private updateLocalHistory(userID: string, show: Show): void {
    if (!this.history[userID]) {
      this.history[userID] = [];
    }
    const alreadyExists = this.history[userID].some(s => s.id === show.id);
    if (!alreadyExists) {
      this.history[userID].push(show);
    }
  }

  private removeFromLocalHistory(userID: string, showID: number): void {
    if (this.history[userID]) {
      this.history[userID] = this.history[userID].filter(s => s.id !== showID);
    }
  }

  /**
   * General
   */
  
  async addToDatabase(userID: string, showID: number, category: string): Promise<void> {
    const show = await firstValueFrom(this.tvmazeService.getShowById(showID));
    const watchListDocRef = doc(this.firestore, `users/${userID}/${category}/${showID}`);

    await setDoc(watchListDocRef, {
      showID,
      addedAt: new Date()
    });

    switch (category){
      case AppConstants.CATEGORIES.WATCH_LIST:
        this.updateLocalWatchList(userID, show);
        break;
      case AppConstants.CATEGORIES.HISTORY:
        this.updateLocalHistory(userID, show);
        break;
    }

    console.log(`Added show ${show.name} (ID: ${showID}) to ${category} for user ${userID}`);
  }

  async load(userID: string, category: string): Promise<void> {
    const collectionRef = collection(this.firestore, `users/${userID}/${category}`);
    const querySnapshot = await getDocs(collectionRef);

    const showPromises: Promise<Show>[] = [];
    querySnapshot.forEach((docSnap) => {
      const data = docSnap.data();
      if (data && data['showID']) {
        showPromises.push(firstValueFrom(this.tvmazeService.getShowById(data['showID'])));
      }
    });

    const shows = await Promise.all(showPromises);

    switch (category){
      case AppConstants.CATEGORIES.WATCH_LIST:
        this.watchList[userID] = shows;
        break;
      case AppConstants.CATEGORIES.HISTORY:
        this.history[userID] = shows;
        break;
    }

    console.log(`Loaded ${category} for user ${userID} with ${shows.length} shows.`);
  }

  async deleteFromDatabase(userID: string, showID: number, category: string): Promise<void> {
    const watchListDocRef = doc(this.firestore, `users/${userID}/${category}/${showID}`);
    
    await deleteDoc(watchListDocRef);
  
    switch (category) {
      case AppConstants.CATEGORIES.WATCH_LIST:
        this.removeFromLocalWatchList(userID, showID);
        break;
      case AppConstants.CATEGORIES.HISTORY:
        this.removeFromLocalHistory(userID, showID);
        break;
    }
  }
  
}
