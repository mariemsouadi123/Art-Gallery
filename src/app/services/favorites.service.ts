import { Injectable, Inject, PLATFORM_ID, signal } from '@angular/core';
import { Artwork } from './artwork.service';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class FavoritesService {
  private favorites = signal<Artwork[]>([]);
  private isBrowser: boolean;

  constructor(@Inject(PLATFORM_ID) platformId: Object) {
    this.isBrowser = isPlatformBrowser(platformId);
    this.loadFavorites();
  }

  private loadFavorites(): void {
    if (this.isBrowser) {
      try {
        const savedFavorites = localStorage.getItem('artgallery-favorites');
        if (savedFavorites) {
          this.favorites.set(JSON.parse(savedFavorites));
        }
      } catch (e) {
        console.error('Error loading favorites from localStorage', e);
      }
    }
  }

  private saveFavorites(favorites: Artwork[]): void {
    if (this.isBrowser) {
      try {
        localStorage.setItem('artgallery-favorites', JSON.stringify(favorites));
      } catch (e) {
        console.error('Error saving favorites to localStorage', e);
      }
    }
  }

  getFavorites() {
    return this.favorites();
  }

  addToFavorites(artwork: Artwork) {
    if (!this.isFavorite(artwork.id)) {
      this.favorites.update(fav => {
        const newFavorites = [...fav, artwork];
        this.saveFavorites(newFavorites);
        return newFavorites;
      });
    }
  }

  removeFromFavorites(artworkId: number) {
    this.favorites.update(fav => {
      const newFavorites = fav.filter(a => a.id !== artworkId);
      this.saveFavorites(newFavorites);
      return newFavorites;
    });
  }

  isFavorite(artworkId: number): boolean {
    return this.favorites().some(a => a.id === artworkId);
  }

  toggleFavorite(artwork: Artwork) {
    if (this.isFavorite(artwork.id)) {
      this.removeFromFavorites(artwork.id);
    } else {
      this.addToFavorites(artwork);
    }
  }
}