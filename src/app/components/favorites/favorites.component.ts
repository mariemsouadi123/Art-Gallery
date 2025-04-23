import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FavoritesService } from '../../services/favorites.service';
import { Artwork } from '../../services/artwork.service';

@Component({
  selector: 'app-favorites',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './favorites.component.html',
  styleUrls: ['./favorites.component.css']
})
export class FavoritesComponent {
  constructor(public favoritesService: FavoritesService) {}

  removeFavorite(artworkId: number, event: Event) {
    event.stopPropagation();
    this.favoritesService.removeFromFavorites(artworkId);
  }
}