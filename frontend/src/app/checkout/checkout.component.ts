import { Component, OnInit, AfterViewInit } from '@angular/core';
import { CartService } from '../cart.service';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { loadStripe, Stripe } from '@stripe/stripe-js';
import { OrderService } from '../order.service';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss'],
})
export class CheckoutComponent implements OnInit, AfterViewInit {
  cartItems: any[] = [];
  totalAmount: number = 0;
  shippingDetails = { name: '', address: '', city: '', phone: '' };
  stripe: Stripe | null = null;
  card: any;

  constructor(
    private cartService: CartService,
    private orderService: OrderService,
    private http: HttpClient,
    private router: Router
  ) {}

  ngOnInit() {
    this.cartService.getCart().subscribe((cart) => {
      this.cartItems = cart?.items || [];
      this.totalAmount = this.cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
    });
  }

  async ngAfterViewInit() {
    await this.initializeStripe();
  }

  async initializeStripe() {
    this.stripe = await loadStripe('pk_test_51R2zvLRRYNT3H9JqUlJznuQKTUnCOlkuCukGeSaap33Gvrp1KSeH0Ex5VyS7l2UlRGn0O7Q3J1vAlkKtOraVd1Fm00y87QTCBN'); // Replace with your actual Stripe public key
    if (!this.stripe) {
      console.error('Stripe failed to initialize.');
      return;
    }

    const elements = this.stripe.elements();
    this.card = elements.create('card');
    this.card.mount('#card-element');

    this.card.on('change', (event: any) => {
      const displayError = document.getElementById('card-errors');
      if (displayError) {
        displayError.textContent = event.error ? event.error.message : '';
      }
    });
  }

  async processStripePayment() {
    if (!this.shippingDetails.name || !this.shippingDetails.address || !this.shippingDetails.city || !this.shippingDetails.phone) {
      alert('Please fill in all shipping details.');
      return;
    }

    if (!this.stripe || !this.card) {
      alert('Payment system is not initialized. Please reload the page.');
      return;
    }

    try {
      const { paymentMethod, error } = await this.stripe.createPaymentMethod({
        type: 'card',
        card: this.card,
        billing_details: {
          name: this.shippingDetails.name,
          email: 'customer@example.com',
          phone: this.shippingDetails.phone,
        },
      });

      if (error) {
        console.error('Payment Method Error:', error);
        alert(error.message);
        return;
      }

      // Step 1: Create PaymentIntent
      this.http.post<any>('http://localhost:5000/payment/create-payment-intent', {
        amount: this.totalAmount * 100, // Ensure it's in cents/paise
        currency: 'INR',
      }).subscribe(async (response) => {
        if (response.clientSecret && response.paymentIntentId) {
          await this.confirmPayment(response.clientSecret, response.paymentIntentId, paymentMethod.id);
        } else {
          alert('Payment initialization failed.');
        }
      });
    } catch (error) {
      console.error('Error processing payment:', error);
      alert('Payment could not be processed. Please try again.');
    }
  }

  async confirmPayment(clientSecret: string, paymentIntentId: string, paymentMethodId: string) {
    if (!this.stripe) {
      alert('Stripe is not initialized.');
      return;
    }

    try {
      // Step 2: Confirm PaymentIntent
      this.http.post<any>('http://localhost:5000/payment/confirm-payment-intent', {
        paymentIntentId,
        paymentMethodId,
      }).subscribe(async (response) => {
        if (response.success && response.paymentIntent.status === 'succeeded') {
          this.placeOrder();
        } else {
          alert('Payment failed.');
        }
      });
    } catch (error) {
      console.error('Error confirming payment:', error);
      alert('Payment confirmation failed.');
    }
  }

  placeOrder() {
    const orderData = {
      products: this.cartItems.map((item) => ({
        productId: item.productId, // Ensure this contains the correct ObjectId
        quantity: item.quantity,
    })),    
      totalAmount: this.totalAmount,
      shippingAddress: `${this.shippingDetails.name}, ${this.shippingDetails.address}, ${this.shippingDetails.city}, ${this.shippingDetails.phone}`
    };
  
    console.log('Order Data:', JSON.stringify(orderData, null, 2));

  
    this.orderService.placeOrder(orderData).subscribe({
      next: () => {
        alert('Order placed successfully!');
        this.cartService.clearCart().subscribe(() => {
          this.router.navigate(['/success']);
        });
      },
      error: (error) => {
        console.error('Order placement failed:', error);
        alert('Order placement failed. Check console for details.');
      },
    });
  }
  
  
}
