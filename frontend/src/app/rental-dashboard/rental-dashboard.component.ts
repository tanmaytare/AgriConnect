import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { EquipmentRentalService } from '../equipment-rental.service';
  
@Component({
  selector: 'app-rental-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './rental-dashboard.component.html',
  styleUrl: './rental-dashboard.component.scss'
})
export class RentalDashboardComponent implements OnInit {
  
  myEquipments: any[] = []; // Store equipment data

  constructor(private rentalService: EquipmentRentalService,private http: HttpClient) {}

  ngOnInit() {
    this.loadMyEquipments(); // Load equipment on component start
  }

  // Fetch farmer's equipment
  loadMyEquipments() {
    this.rentalService.getMyEquipments().subscribe({
      next: (equipments) => {
        this.myEquipments = equipments;
      },
      error: (err) => {
        console.error('Failed to fetch equipment:', err);
      }
    });
  }

  // Delete an equipment
  deleteEquipment(equipmentId: string) {
    if (!confirm('Are you sure you want to delete this equipment?')) return;

    this.rentalService.deleteEquipment(equipmentId).subscribe({
      next: () => {
        console.log('Equipment deleted');
        this.loadMyEquipments(); // Reload after deletion
      },
      error: (err) => {
        console.error('Failed to delete equipment:', err);
      }
    });
  }
}
