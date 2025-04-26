import { Routes } from '@angular/router';
import { RegisterComponent } from './components/register/register.component';
import { LoginComponent } from './components/login/login.component';
import { HomeComponent } from './components/home/home.component';
import { UserHomeComponent } from './components/user-home/user-home.component';
import { MarketplaceComponent } from './components/marketplace/marketplace.component';
import { CheckoutComponent } from './components/checkout/checkout.component';
import { AdminDashboardComponent } from './components/admin-dashboard/admin-dashboard.component';
import { FavoritesComponent } from './components/favorites/favorites.component';
import { UserProfileComponent } from './components/user-profile/user-profile.component';
import { UserManagementComponent } from './components/user-management/user-management.component';
import { DashboardHomeComponent } from './components/dashboard-home/dashboard-home.component';
import { ArtworkManagementComponent } from './components/artwork-management/artwork-management.component';
import { PaymentManagementComponent } from './components/payment-management/payment-management.component';
import { ExhibitionsComponent } from './components/exhibitions/exhibitions.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'login', component: LoginComponent },
  { path: 'user-home', component: UserHomeComponent },
  { path: 'marketplace', component: MarketplaceComponent },
  { path: 'checkout', component: CheckoutComponent },
  { path: 'favorites', component: FavoritesComponent },
  { path: 'user-profile', component: UserProfileComponent },
  { path: 'exhibitions', component: ExhibitionsComponent },  
  // Admin routes with nested children - using 'admin-dashboard' as base path
  { 
    path: 'admin-dashboard', 
    component: AdminDashboardComponent,
    children: [
      { path: '', component: DashboardHomeComponent }, // Default admin dashboard view
      { path: 'users', component: UserManagementComponent },
      { path: 'artworks', component: ArtworkManagementComponent },
      { path: 'payments', component: PaymentManagementComponent }
    ]
  }
];
