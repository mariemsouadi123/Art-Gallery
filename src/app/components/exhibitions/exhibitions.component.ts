import { Component, OnInit, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { Artwork, ArtworkService } from '../../services/artwork.service';
import { FavoritesService } from '../../services/favorites.service';

@Component({
  selector: 'app-exhibitions',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './exhibitions.component.html',
  styleUrls: ['./exhibitions.component.css']
})
export class ExhibitionsComponent implements OnInit {
  artworks = signal<Array<{
    id: number;
    title: string;
    description: string;
    price: number;
    artistName: string;
    available: boolean;
    imageUrl: string;
  }>>([]);

  isLoading = signal<boolean>(true);
  error = signal<string | null>(null);
  showAvailableOnly = signal<boolean>(false);

  constructor(
    private artworkService: ArtworkService,
    public favoritesService: FavoritesService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadAllArtworks();
  }

  loadAllArtworks(): void {
    this.isLoading.set(true);
    this.error.set(null);

    this.artworkService.getAllArtworks().subscribe({
      next: (artworks: any[]) => {
        const transformedArtworks = artworks.map(artwork => ({
          ...artwork,
          imageUrl: this.artworkService.getArtworkImageUrl(artwork.id)
        }));
        this.artworks.set(transformedArtworks);
        this.isLoading.set(false);
      },
      error: (err: any) => {
        console.error('Error loading artworks:', err);
        this.error.set('Failed to load artworks. Please try again.');
        this.isLoading.set(false);
      }
    });
  }
  addToCart(event: Event): void {
    event.stopPropagation(); // Prevent event bubbling
    this.router.navigate(['/login']);
  }

  viewDetails(artworkId: number): void {
    this.router.navigate(['/login']);
  }

  filteredArtworks = computed(() =>
    this.showAvailableOnly()
      ? this.artworks().filter(a => a.available)
      : this.artworks()
  );

  handleImageError(event: Event): void {
    (event.target as HTMLImageElement).src = 'assets/images/placeholder.png';
  }

  toggleFavorite(artwork: Artwork, event: Event): void {
    event.stopPropagation();
    this.router.navigate(['/login']);
  }
}