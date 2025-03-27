import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ProductService } from '../product.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './products.component.html',
  styleUrl: './products.component.scss'
})
export class ProductsComponent implements OnInit {

  isModalOpen = false;
  selectedFile: File | null = null;
  imageUrl: string = ''; // Stores Cloudinary image URL
  userProducts: any[] = []; // Will store fetched products

  constructor(private productService: ProductService, private http: HttpClient) {}

  productForm = new FormGroup({
    name: new FormControl('', [Validators.required]),
    category: new FormControl('Crop', [Validators.required]),
    price: new FormControl('', [Validators.required, Validators.min(1)]),
    quantity: new FormControl('', [Validators.required, Validators.min(1)]),
    description: new FormControl('', [Validators.required]),
    image: new FormControl('')
  });

  // Fetch products on component initialization
  ngOnInit() {
    this.loadProducts();
  }

  loadProducts() {
    this.productService.getMyProducts().subscribe({
      next: (products) => {
        this.userProducts = products;
      },
      error: (err) => {
        console.error('Failed to load products:', err);
      }
    });
  }

  openSellProductModal() {
    this.isModalOpen = true;
  }

  closeSellProductModal() {
    this.isModalOpen = false;
  }

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0]; 
    if (this.selectedFile) {
      this.uploadImageToCloudinary(this.selectedFile);
    }
  }

  uploadImageToCloudinary(file: File) {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'AgriConnect');

    this.http.post<any>('https://api.cloudinary.com/v1_1/dsd6kt4v5/image/upload', formData, {
      headers: {}
    }).subscribe({
      next: (response) => {
        this.imageUrl = response.secure_url;
        this.productForm.patchValue({ image: this.imageUrl });
      },
      error: (error) => {
        console.error('Cloudinary upload failed', error);
      }
    });
  }

  submitProductForm() {
    if (this.productForm.valid) {
      if (!this.imageUrl) {
        console.warn('Image upload in progress. Please wait.');
        return; // Prevent submission until the image URL is ready
      }
  
      const productData = { ...this.productForm.value, image: this.imageUrl };
  
      this.productService.addProduct(productData).subscribe({
        next: (response) => {
          console.log('Product added:', response);
          this.closeSellProductModal();
          this.loadProducts();
        },
        error: (error) => {
          console.error('Failed to add product:', error);
        }
      });
    }
  }
  

  deleteProduct(productId: string | undefined) {
    if (!productId) {
      console.error('Invalid product ID:', productId);
      return;
    }
  
    this.productService.deleteProduct(productId).subscribe({
      next: () => {
        console.log('Product deleted successfully');
        this.loadProducts();
      },
      error: (error) => {
        console.error('Failed to delete product:', error);
      }
    });
  }
  
}
