import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  private apiUrl = 'http://localhost:5000/order'; // Adjust this if needed

  constructor(private http: HttpClient) {}

  // Place an order
  placeOrder(orderData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/place-order`, orderData);
  }

  // Fetch user orders
  getUserOrders(): Observable<any> {
    return this.http.get(`${this.apiUrl}/my-orders`);
  }
}
