import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ProductService } from '../product.service';
import { CartService } from '../cart.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-marketplace',
  standalone: true,
  imports: [CommonModule,RouterLink,FormsModule],
  templateUrl: './marketplace.component.html',
  styleUrls: ['./marketplace.component.scss'],
})
export class MarketplaceComponent implements OnInit {
  products: any[] = [];
  filteredProducts: any[] = [];
  categories: string[] = ['Crop','Fertilizers', 'Seeds', 'Tools'];
  searchQuery: string = '';
  selectedCategory: string = '';

  constructor(private productService: ProductService, private cartService: CartService) {}

  ngOnInit() {
    this.loadProducts();
  }

  loadProducts() {
    this.productService.getAllProducts().subscribe(products => {
      this.products = products.map((p: any) => ({ ...p, quantity: 1 })); // Default quantity
      this.filteredProducts = this.products;
    });
  }

  searchProducts() {
    this.filteredProducts = this.products.filter(product =>
      product.name.toLowerCase().includes(this.searchQuery.toLowerCase())
    );
  }

  filterByCategory() {
    this.filteredProducts = this.selectedCategory
      ? this.products.filter(product => product.category === this.selectedCategory)
      : this.products;
  }

  addToCart(product: any) {
    console.log("Adding to cart:", product);  // Debugging
    this.cartService.addToCart(product).subscribe(response => {
      console.log("Cart updated:", response);
    });
  }
  
}