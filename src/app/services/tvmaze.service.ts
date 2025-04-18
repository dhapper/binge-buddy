import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/internal/Observable';
import { Show } from '../models/show';
import { environment } from '../../environments/environment'
import { map, forkJoin } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TvmazeService {

  constructor(private http: HttpClient) { }

  getShows(query: string): Observable<{ show: Show }[]> {
    return this.http.get<{ show: Show }[]>(`${environment.TVMAZE_API_URL}/search/shows?q=${query}`);
  }

  getShowById(showId: number): Observable<Show> {
    return this.http.get<Show>(`${environment.TVMAZE_API_URL}/shows/${showId}`);
  }

  // Get all shows from a page
  getPopularShows(page: number): Observable<Show[]> {
    return this.http.get<Show[]>(`${environment.TVMAZE_API_URL}/shows?page=${page}`);
  }

  getAllShows(page: number = 0): Observable<Show[]> {
    return this.http.get<Show[]>(`${environment.TVMAZE_API_URL}/shows?page=${page}`);
  }

  getRecommendedShows(watchedShows: Show[]): Observable<Show[]> {
    const genreFrequency: Record<string, number> = {};
  
    // Count how often each genre appears in the watch history
    watchedShows.forEach(show => {
      show.genres.forEach(genre => {
        genreFrequency[genre] = (genreFrequency[genre] || 0) + 1;
      });
    });
  
    // Fetch shows from API (can expand to more pages)
    return this.getAllShows(0).pipe(
      map((allShows: Show[]) => {
        return allShows
          .map(show => {
            // Score each show based on how well its genres match user's favorite genres
            const overlapScore = show.genres.reduce((score, genre) => {
              return score + (genreFrequency[genre] || 0);
            }, 0);
  
            return { show, score: overlapScore };
          })
          .filter(entry =>
            entry.score >= 2 && // only recommend if at least 2 genre matches
            !watchedShows.some(watched => watched.id === entry.show.id) &&
            entry.show.rating?.average && entry.show.rating.average >= 7.5 &&
            entry.show.summary && entry.show.image // filter for quality
          )
          .sort((a, b) => b.score - a.score) // sort by best match
          .slice(0, 20) // pick top 20
          .map(entry => entry.show);
      })
    );
  }

}
