import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserService, User, PaginatedUsers } from '../../services/user.service';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-user-management',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.css']
})
export class UserManagementComponent implements OnInit {
  users: User[] = [];
  isLoading = false;
  totalUsers = 0;
  currentPage = 1;
  pageSize = 10;
  searchTerm = '';
  selectedUser: (User & { tempPassword?: string }) | null = null; // Temporary password field
  isEditModalOpen = false;

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.isLoading = true;
    this.userService.getUsers(this.currentPage, this.pageSize).subscribe({
      next: (response) => {
        this.users = response.users;
        this.totalUsers = response.total;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading users', err);
        this.isLoading = false;
      }
    });
  }

  openEditModal(user: User): void {
    this.selectedUser = { ...user, tempPassword: '' };
    this.isEditModalOpen = true;
  }

  updateUser(): void {
    if (this.selectedUser) {
      // Create update payload without modifying the original selectedUser
      const updateData: Partial<User> = { 
        ...this.selectedUser,
        ...(this.selectedUser.tempPassword ? { password: this.selectedUser.tempPassword } : {})
      };
      
      // Remove the temporary password field before sending
      delete updateData.password;

      this.userService.updateUser(this.selectedUser.id, updateData).subscribe({
        next: () => {
          this.loadUsers();
          this.isEditModalOpen = false;
          alert('User updated successfully');
        },
        error: (err) => {
          console.error('Error updating user', err);
          alert('Error updating user');
        }
      });
    }
  }

  deleteUser(id: number): void {
    if (confirm('Are you sure you want to delete this user?')) {
      this.userService.deleteUser(id).subscribe({
        next: () => {
          this.loadUsers();
          alert('User deleted successfully');
        },
        error: (err) => {
          console.error('Error deleting user', err);
          alert('Error deleting user');
        }
      });
    }
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.loadUsers();
  }

  getPages(): number[] {
    const pageCount = Math.ceil(this.totalUsers / this.pageSize);
    return Array.from({ length: pageCount }, (_, i) => i + 1);
  }
}