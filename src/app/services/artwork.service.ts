import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface Artwork {
  id: number;
  title: string;
  description: string;
  price: number;
  artistName: string;
  available: boolean;
  imageUrl?: string;
  artistId?: number;
}

export interface PaginatedArtworks {
  artworks: Artwork[];
  total: number;
  page: number;
  pageSize: number;
}

@Injectable({
  providedIn: 'root'
})
export class ArtworkService {
  private apiUrl = 'http://localhost:8080/artworks';

  constructor(private http: HttpClient) {}

  // Keep this method to maintain compatibility with MarketplaceComponent
  getAllArtworks(): Observable<Artwork[]> {
    return this.http.get<Artwork[]>(this.apiUrl).pipe(
      map((response: any) => {
        // Handle both array response and paginated response
        if (Array.isArray(response)) {
          return response;
        } else if (response.artworks) {
          return response.artworks;
        }
        return [];
      })
    );
  }

  // New paginated version
  getArtworks(page: number = 1, size: number = 10): Observable<PaginatedArtworks> {
    const params = new HttpParams()
      .set('page', (page - 1).toString()) // Backend expects 0-based index
      .set('size', size.toString());

    return this.http.get<PaginatedArtworks>(this.apiUrl, { params });
  }

  getAvailableArtworks(): Observable<Artwork[]> {
    return this.http.get<Artwork[]>(`${this.apiUrl}/available`).pipe(
      map((response: any) => {
        if (Array.isArray(response)) {
          return response;
        } else if (response.artworks) {
          return response.artworks;
        }
        return [];
      })
    );
  }

  getSoldArtworks(): Observable<Artwork[]> {
    return this.http.get<Artwork[]>(`${this.apiUrl}/sold`).pipe(
      map((response: any) => {
        if (Array.isArray(response)) {
          return response;
        } else if (response.artworks) {
          return response.artworks;
        }
        return [];
      })
    );
  }

  getArtworkImageUrl(id: number): string {
    return `${this.apiUrl}/${id}/image`;
  }

  // Add other methods as needed...
  createArtwork(artwork: FormData): Observable<Artwork> {
    return this.http.post<Artwork>(`${this.apiUrl}/upload`, artwork);
  }

  updateArtwork(id: number, artwork: Partial<Artwork>): Observable<Artwork> {
    return this.http.put<Artwork>(`${this.apiUrl}/${id}`, artwork);
  }

  deleteArtwork(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  toggleAvailability(id: number): Observable<void> {
    return this.http.patch<void>(`${this.apiUrl}/${id}/availability`, {});
  }
  // Add to your artwork.service.ts
  getArtworksCount(): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/count`, { withCredentials: true });
  }
}