import { Component, OnInit } from '@angular/core';
import { EquipmentRentalService } from '../equipment-rental.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-rented',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './rented.component.html',
  styleUrl: './rented.component.scss'
})
export class RentedHistoryComponent implements OnInit {
  rentedHistory: any[] = [];

  constructor(private rentalService: EquipmentRentalService) {}

  ngOnInit(): void {
    this.fetchRentedHistory();
  }

  fetchRentedHistory() {
    this.rentalService.getUserRentals().subscribe({
      next: (response) => {
        if (response.success) {
          this.rentedHistory = response.rentals;
        }
      },
      error: (error) => {
        console.error('Error fetching rented history:', error);
      },
    });
  }
}
