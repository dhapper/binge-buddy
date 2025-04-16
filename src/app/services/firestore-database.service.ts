import { Injectable } from '@angular/core';
import { Firestore, doc, getDocs, collection, setDoc } from '@angular/fire/firestore';
import { TvmazeService } from './tvmaze.service';
import { firstValueFrom } from 'rxjs';
import { Show } from '../models/show';

@Injectable({
  providedIn: 'root',
})
export class FirestoreDatabase {
  private watchList: { [key: string]: Show[] } = {};

  constructor(
    private firestore: Firestore,
    private tvmazeService: TvmazeService
  ) {}

  /**
   * Adds a show to the user's watch list in Firestore and updates the local cache.
   */
  async addToWatchList(userID: string, showID: number): Promise<void> {
    const show = await firstValueFrom(this.tvmazeService.getShowById(showID));
    const watchListDocRef = doc(this.firestore, `users/${userID}/watch-list/${showID}`);
    
    await setDoc(watchListDocRef, {
      showID,
      addedAt: new Date()
    });

    this.updateLocalWatchList(userID, show);
    console.log(`Added show ${show.name} (ID: ${showID}) to watch list for user ${userID}`);
  }

  /**
   * Updates the local watch list cache.
   */
  private updateLocalWatchList(userID: string, show: Show): void {
    if (!this.watchList[userID]) {
      this.watchList[userID] = [];
    }
    const alreadyExists = this.watchList[userID].some(s => s.id === show.id);
    if (!alreadyExists) {
      this.watchList[userID].push(show);
    }
  }

  /**
   * Returns the local watch list for the specified user.
   */
  getLocalWatchList(userID: string): Show[] {
    return this.watchList[userID] || [];
  }

  /**
   * Loads the user's watch list from Firestore and fills the local cache with full show data.
   */
  async loadWatchList(userID: string): Promise<void> {
    const watchListCollectionRef = collection(this.firestore, `users/${userID}/watch-list`);
    const querySnapshot = await getDocs(watchListCollectionRef);

    const showPromises: Promise<Show>[] = [];
    querySnapshot.forEach((docSnap) => {
      const data = docSnap.data();
      if (data && data['showID']) {
        showPromises.push(firstValueFrom(this.tvmazeService.getShowById(data['showID'])));
      }
    });

    const shows = await Promise.all(showPromises);
    this.watchList[userID] = shows;
    console.log(`Loaded watch list for user ${userID} with ${shows.length} shows.`);
  }
}
