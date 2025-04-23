import { Component, OnInit, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { Artwork, ArtworkService } from '../../services/artwork.service';
import { CartService } from '../../services/cart.service';
import { FavoritesService } from '../../services/favorites.service';

@Component({
  selector: 'app-marketplace',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './marketplace.component.html',
  styleUrls: ['./marketplace.component.css']
})
export class MarketplaceComponent implements OnInit {
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

  // CartService doit être public pour être accessible dans le template
  constructor(
    private artworkService: ArtworkService,
    public cartService: CartService,
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
        console.error('Erreur de chargement des œuvres:', err);
        this.error.set('Échec du chargement des œuvres. Veuillez réessayer.');
        this.isLoading.set(false);
      }
    });
  }

  addToCart(artwork: any): void {
    this.cartService.addToCart(artwork);
    alert(`${artwork.title} a été ajouté au panier`);
  }

  viewDetails(artworkId: number): void {
    this.router.navigate(['/artwork', artworkId]);
  }

  goToCheckout(): void {
    this.router.navigate(['/checkout']);
  }

  // Computed signal pour filtrer les œuvres disponibles
  filteredArtworks = computed(() =>
    this.showAvailableOnly()
      ? this.artworks().filter(a => a.available)
      : this.artworks()
  );

  // Gestion des erreurs d'affichage d'image
  handleImageError(event: Event): void {
    (event.target as HTMLImageElement).src = 'assets/images/placeholder.png';
  }
  toggleFavorite(artwork: Artwork, event: Event): void {
    event.stopPropagation(); // Empêche la propagation du clic
    this.favoritesService.toggleFavorite(artwork);
  }
}
