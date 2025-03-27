import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private apiUrl = 'http://localhost:5000/cart';

  constructor(private http: HttpClient) {}

  // Get userId dynamically from localStorage
  private getUserId(): string | null {
    return localStorage.getItem('userId'); // Or sessionStorage.getItem('userId')
  }

  getCart(): Observable<any> {
    const userId = this.getUserId();
    if (!userId) {
      throw new Error('User not logged in');
    }
    return this.http.get(`${this.apiUrl}/${userId}`);
  }

  addToCart(product: any): Observable<any> {
    const userId = this.getUserId();
    if (!userId) {
      throw new Error('User not logged in');
    }
    return this.http.post(`${this.apiUrl}/add`, {
      userId: userId,
      productId: product._id,
      name: product.name,
      price: product.price,
      quantity: product.quantity
    });
  }

  updateCart(product: any): Observable<any> {  // <-- Update method for quantity change
    return this.http.put<any>(`${this.apiUrl}/update`, product);
  }


  removeFromCart(productId: string): Observable<any> {
    const userId = this.getUserId();
    if (!userId) {
      throw new Error('User not logged in');
    }
    return this.http.delete(`${this.apiUrl}/remove/${userId}/${productId}`);
  }

   // **NEW METHOD: Clear Cart**
   clearCart(): Observable<any> {
    const userId = this.getUserId();
    if (!userId) {
      throw new Error('User not logged in');
    }
    return this.http.delete(`${this.apiUrl}/clear/${userId}`);
  }
}
