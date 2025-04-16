import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/internal/Observable';
import { Show } from '../models/show';
import { environment } from '../../environments/environment'

@Injectable({
  providedIn: 'root'
})
export class TvmazeService {

  constructor(private http: HttpClient) {}

  getShows(query: string): Observable<{ show: Show }[]> {
    return this.http.get<{ show: Show }[]>(`${environment.TVMAZE_API_URL}/search/shows?q=${query}`);
  }

  getShowById(showId: number): Observable<Show> {
    return this.http.get<Show>(`${environment.TVMAZE_API_URL}/shows/${showId}`);
  }
}
