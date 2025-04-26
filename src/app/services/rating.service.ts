import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Rating {
  id: number;
  artworkId: number; // Changed to match Artwork.id type
  userId: number;
  value: number;
  createdAt: Date;
}

@Injectable({
  providedIn: 'root'
})
export class RatingService {
  private apiUrl = 'api/ratings'; // Update with your API endpoint

  constructor(private http: HttpClient) {}

  getRatingsForArtwork(artworkId: string): Observable<Rating[]> {
    return this.http.get<Rating[]>(`${this.apiUrl}?artworkId=${artworkId}`);
  }

  addRating(artworkId: string, value: number): Observable<Rating> {
    // In a real app, you'd include the user ID from your auth service
    return this.http.post<Rating>(this.apiUrl, {
      artworkId,
      value
    });
  }
}