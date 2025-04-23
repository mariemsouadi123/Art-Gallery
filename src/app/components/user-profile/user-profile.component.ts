import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import {User} from '../../services/auth.service';
@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit {
  profileForm: FormGroup;
  user: User | null = null;
  isLoading: boolean = true;
  errorMessage: string = '';
  successMessage: string = '';
  isEditing: boolean = false;
  selectedFile: File | null = null;
  previewImage: string | null = null;

  constructor(
    private authService: AuthService,
    private router: Router,
    private fb: FormBuilder
  ) {
    this.profileForm = this.fb.group({
      fullName: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      phone: [''],
      address: [''],
    });
  }

  ngOnInit(): void {
    this.loadUserProfile();
    
    // Subscribe to user updates
    this.authService.getCurrentUserObservable().subscribe(user => {
      if (user) {
        this.user = user;
        this.previewImage = user.imageUrl || 'assets/default-profile.jpg';
      }
    });
  }

  private loadUserProfile(): void {
    const currentUser = this.authService.getCurrentUser();
    if (!currentUser) {
      this.handleInvalidUser();
      return;
    }

    this.user = currentUser;
    this.previewImage = currentUser.imageUrl || 'assets/default-profile.jpg';
    this.profileForm.patchValue({
      fullName: currentUser.fullName,
      email: currentUser.email,
      phone: currentUser.phone || '',
      address: currentUser.address || '',
    });
    this.isLoading = false;
  }

  private handleInvalidUser(): void {
    this.errorMessage = 'Invalid session. Please login again.';
    this.authService.logout().subscribe({
      next: () => this.router.navigate(['/login']),
      error: (err) => console.error('Logout error:', err)
    });
  }

  toggleEdit(): void {
    this.isEditing = !this.isEditing;
    if (!this.isEditing) {
      this.loadUserProfile();
      this.selectedFile = null;
    }
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      this.selectedFile = input.files[0];
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.previewImage = e.target.result;
      };
      reader.readAsDataURL(this.selectedFile);
    }
  }

  onSubmit(): void {
    if (this.profileForm.invalid || !this.user) {
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';
    this.successMessage = '';

    const formData = new FormData();
    const formValues = this.profileForm.value;

    // Append all form values
    Object.keys(formValues).forEach(key => {
      if (formValues[key] !== null && formValues[key] !== undefined) {
        formData.append(key, formValues[key]);
      }
    });

    // Append image file if selected
    if (this.selectedFile) {
      formData.append('image', this.selectedFile, this.selectedFile.name);
    }

    this.authService.updateUserProfile(this.user.id, formData).subscribe({
      next: (updatedUser) => {
        this.successMessage = 'Profile updated successfully!';
        setTimeout(() => this.successMessage = '', 3000);
        this.isEditing = false;
        this.isLoading = false;
        // Update preview image with the new URL
        if (updatedUser.imageUrl) {
          this.previewImage = updatedUser.imageUrl;
        }
      },
      error: (error) => {
        console.error('Error updating profile:', error);
        this.errorMessage = this.getErrorMessage(error);
        this.isLoading = false;
      }
    });
}
  private getErrorMessage(error: any): string {
    if (error.status === 401) {
      return 'Unauthorized to update profile. Please login again.';
    }
    if (error.error?.message) {
      return error.error.message;
    }
    return 'Error updating profile. Please try again later.';
  }

  logout(): void {
    this.authService.logout().subscribe({
      next: () => this.router.navigate(['/login']),
      error: (error) => {
        console.error('Logout error:', error);
        this.router.navigate(['/login']);
      }
    });
  }
}

