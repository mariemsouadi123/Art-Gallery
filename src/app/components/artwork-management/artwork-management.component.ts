// artwork-management.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ArtworkService, Artwork, PaginatedArtworks } from '../../services/artwork.service';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-artwork-management',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './artwork-management.component.html',
  styleUrls: ['./artwork-management.component.css']
})
export class ArtworkManagementComponent implements OnInit {
  artworks: Artwork[] = [];
  isLoading = false;
  totalArtworks = 0;
  currentPage = 1;
  pageSize = 10;
  searchTerm = '';
  selectedArtwork: Artwork | null = null;
  isEditModalOpen = false;
  isCreateModalOpen = false;
  newArtwork: Partial<Artwork> = {};
  selectedFile: File | null = null;

  constructor(private artworkService: ArtworkService) {}

  ngOnInit(): void {
    this.loadArtworks();
  }

  loadArtworks(): void {
    this.isLoading = true;
    this.artworkService.getArtworks(this.currentPage, this.pageSize).subscribe({
      next: (response) => {
        this.artworks = response.artworks;
        this.totalArtworks = response.total;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading artworks', err);
        this.isLoading = false;
      }
    });
  }

  openEditModal(artwork: Artwork): void {
    this.selectedArtwork = { ...artwork };
    this.isEditModalOpen = true;
  }

  openCreateModal(): void {
    this.newArtwork = {
      title: '',
      description: '',
      price: 0,
      available: true
    };
    this.isCreateModalOpen = true;
  }

  onFileSelected(event: any): void {
    this.selectedFile = event.target.files[0];
  }

  createArtwork(): void {
    if (!this.newArtwork || !this.selectedFile) return;

    const formData = new FormData();
    formData.append('file', this.selectedFile);
    formData.append('title', this.newArtwork.title || '');
    formData.append('description', this.newArtwork.description || '');
    formData.append('price', (this.newArtwork.price || 0).toString());
    if (this.newArtwork.artistId) {
      formData.append('artistId', this.newArtwork.artistId.toString());
    }

    this.artworkService.createArtwork(formData).subscribe({
      next: () => {
        this.loadArtworks();
        this.isCreateModalOpen = false;
        alert('Artwork created successfully');
      },
      error: (err) => {
        console.error('Error creating artwork', err);
        alert('Error creating artwork');
      }
    });
  }

  updateArtwork(): void {
    if (!this.selectedArtwork) return;

    this.artworkService.updateArtwork(this.selectedArtwork.id, this.selectedArtwork).subscribe({
      next: () => {
        this.loadArtworks();
        this.isEditModalOpen = false;
        alert('Artwork updated successfully');
      },
      error: (err) => {
        console.error('Error updating artwork', err);
        alert('Error updating artwork');
      }
    });
  }

  deleteArtwork(id: number): void {
    if (confirm('Are you sure you want to delete this artwork?')) {
      this.artworkService.deleteArtwork(id).subscribe({
        next: () => {
          this.loadArtworks();
          alert('Artwork deleted successfully');
        },
        error: (err) => {
          console.error('Error deleting artwork', err);
          alert('Error deleting artwork');
        }
      });
    }
  }

  toggleAvailability(id: number): void {
    this.artworkService.toggleAvailability(id).subscribe({
      next: () => {
        this.loadArtworks();
        alert('Availability updated successfully');
      },
      error: (err) => {
        console.error('Error toggling availability', err);
        alert('Error toggling availability');
      }
    });
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.loadArtworks();
  }

  getPages(): number[] {
    const pageCount = Math.ceil(this.totalArtworks / this.pageSize);
    return Array.from({ length: pageCount }, (_, i) => i + 1);
  }
}