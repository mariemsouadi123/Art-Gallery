import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  cartItems = signal<any[]>([]);

  addToCart(artwork: any) {
    this.cartItems.update(items => [...items, artwork]);
  }

  removeFromCart(index: number) {
    this.cartItems.update(items => items.filter((_, i) => i !== index));
  }

  clearCart() {
    this.cartItems.set([]);
  }

  getTotal() {
    return this.cartItems().reduce((sum, item) => sum + item.price, 0);
  }
}