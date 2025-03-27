// src/app/services/equipment-rental.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class EquipmentRentalService {
  private apiUrl = 'http://localhost:5000/'; // Backend URL

  constructor(private http: HttpClient) {}

  // Fetch all available equipment
  getAvailableEquipment(): Observable<any> {
    return this.http.get(`${this.apiUrl}/equipment/available`);
  }

  // Get equipment details by ID
  getEquipmentById(id: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/equipment/${id}`);
  }

  // Get My equipments
  getMyEquipments(): Observable<any> {
    return this.http.get(`${this.apiUrl}/my-equipments/`);
  }

   // Delete My equipments
   deleteEquipment(id: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/equipments/${id}`);
  }

  // Add new equipment
  addEquipment(equipmentData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/equipment/add`, equipmentData);
  }

  // Rent equipment
  rentEquipment(rentalData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/rentals/rent`, rentalData);
  }

  // Fetch user rentals
  getUserRentals(): Observable<any> {
    return this.http.get(`${this.apiUrl}/rentals/my-rentals`);
  }
}
