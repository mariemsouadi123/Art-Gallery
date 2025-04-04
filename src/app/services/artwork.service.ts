import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ArtworkService {
  private apiUrl = 'http://localhost:8080/artworks';

  constructor(private http: HttpClient) {}

  // Définition du type directement dans la méthode
  getAllArtworks(): Observable<Array<{
    id: number;
    title: string;
    description: string;
    price: number;
    artistName: string;
    available: boolean;
  }>> {
    return this.http.get<Array<{
      id: number;
      title: string;
      description: string;
      price: number;
      artistName: string;
      available: boolean;
    }>>(this.apiUrl);
  }

  getArtworkImageUrl(id: number): string {
    return `${this.apiUrl}/${id}/image`;
  }
}