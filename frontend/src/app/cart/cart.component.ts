import { Component, OnInit } from '@angular/core';
import { CartService } from '../cart.service';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule,RouterLink],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.scss'
})
export class CartComponent implements OnInit {
  cartItems: any[] = [];

  constructor(private cartService: CartService) {}

  ngOnInit() {
    this.cartService.getCart().subscribe(cart => {
      console.log("Fetched Cart:", cart);  // Debugging
      this.cartItems = cart?.items || [];
    });
  }

  increaseQuantity(item: any) {
    item.quantity += 1;  // Increase quantity
    this.cartService.updateCart(item).subscribe(updatedCart => {
      this.cartItems = updatedCart.items;
    });
  }

  decreaseQuantity(item: any) {
    if (item.quantity > 1) {
      item.quantity -= 1;  // Decrease quantity but not below 1
      this.cartService.updateCart(item).subscribe(updatedCart => {
        this.cartItems = updatedCart.items;
      });
    }
  }

  removeItem(productId: string) {
    this.cartService.removeFromCart(productId).subscribe(cart => {
      this.cartItems = cart.items;
    });
  }
}
