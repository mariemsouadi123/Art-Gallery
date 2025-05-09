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
import { authGuard } from './services/auth.guard.service';
import { EventListComponent } from './components/events/event-list/event-list.component';
import { EventDetailsComponent } from './components/events/event-details/event-details.component';
import { EventFormComponent } from './components/events/event-form/event-form.component';
import { EventTicketComponent } from './components/events/event-ticket/event-ticket.component';
import { EventCheckoutComponent } from './components/events/event-checkout/event-checkout.component';
import { EventManagementComponent } from './components/event-management/event-management.component';

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

  
  // User routes
  { 
    path: 'user-home', 
    component: UserHomeComponent,
    canActivate: [authGuard],
    data: { role: 'USER' } 
  },
  { 
    path: 'marketplace', 
    component: MarketplaceComponent,
    canActivate: [authGuard],
    data: { role: 'USER' } 
  },
  { 
    path: 'checkout', 
    component: CheckoutComponent,
    canActivate: [authGuard],
    data: { role: 'USER' } 
  },
  { 
    path: 'favorites', 
    component: FavoritesComponent,
    canActivate: [authGuard],
    data: { role: 'USER' } 
  },
  { 
    path: 'user-profile', 
    component: UserProfileComponent,
    canActivate: [authGuard],
    data: { role: 'USER' } 
  },
  
  // Event routes
  { 
    path: 'events', 
    children: [
      { path: '', component: EventListComponent },
      { path: 'new', component: EventFormComponent },
      { path: ':id', component: EventDetailsComponent },
      { path: ':id/edit', component: EventFormComponent },
      { path: ':id/checkout', component: EventCheckoutComponent },
      { path: ':id/ticket', component: EventTicketComponent }
    ],
    canActivate: [authGuard],
    data: { role: 'USER' }
  },
  // admin routes
  { 
    path: 'admin-dashboard', 
    component: AdminDashboardComponent,
    canActivate: [authGuard],
    data: { role: 'ADMIN' },
    children: [
      { path: '', component: DashboardHomeComponent },
      { path: 'users', component: UserManagementComponent },
      { path: 'artworks', component: ArtworkManagementComponent },
      { path: 'payments', component: PaymentManagementComponent },
      { path: 'events', component: EventManagementComponent },
      { path: 'events/new', component: EventFormComponent },
      { path: 'events/edit/:id', component: EventFormComponent }
    ]
  },
  { path: '**', redirectTo: '' }
];