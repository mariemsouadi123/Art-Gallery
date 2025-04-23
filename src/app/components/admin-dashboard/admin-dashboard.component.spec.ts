import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, RouterOutlet], // Added RouterOutlet
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css']
})
export class AdminDashboardComponent {
logout() {
throw new Error('Method not implemented.');
}
  admin = {
    name: 'Admin Name',
    email: 'admin@example.com',
    role: 'Administrator',
    profileImage: 'https://via.placeholder.com/100'
  };
isLoading: any;
stats: any;
}