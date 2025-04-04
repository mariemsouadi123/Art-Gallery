import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-user-home',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './user-home.component.html',
  styleUrls: ['./user-home.component.css']
})
export class UserHomeComponent implements OnInit {
  fullName: string | null = null;
  userImage: string | null = null;
  purchases: any[] = [];

  constructor(private router: Router) {}

  ngOnInit() {
    this.loadUserData();
    this.loadPurchases();
  }

  private loadUserData() {
    if (typeof window !== 'undefined') {
      const userData = localStorage.getItem('user');
      if (userData) {
        const user = JSON.parse(userData);
        this.fullName = user.full_name;
        this.userImage = user.image_url;
      }
    }
  }

  private loadPurchases() {
    if (typeof window !== 'undefined') {
      const purchasesData = localStorage.getItem('purchases');
      if (purchasesData) {
        this.purchases = JSON.parse(purchasesData);
      }
    }
  }

  logout() {
    if (typeof window !== 'undefined') {
      localStorage.clear();
    }
    this.router.navigate(['/login']);
  }
}