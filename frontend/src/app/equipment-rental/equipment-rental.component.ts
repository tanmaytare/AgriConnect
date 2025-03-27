import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { EquipmentRentalService } from '../equipment-rental.service';
import { HttpClient } from '@angular/common/http';
import { RouterLink } from '@angular/router';


@Component({
  selector: 'app-equipment-rental',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule,RouterLink],
  templateUrl: './equipment-rental.component.html',
  styleUrl: './equipment-rental.component.scss'
})
export class EquipmentRentalComponent implements OnInit {

  isModalOpen = false;
  availableEquipment: any[] = [];
  selectedFile: File | null = null;
  equipmentForm: FormGroup;
  imageUrl: string = ''; 

  constructor(private rentalService: EquipmentRentalService,private http: HttpClient) {
    this.equipmentForm = new FormGroup({
      name: new FormControl('', [Validators.required]),
      category: new FormControl('Tractor', [Validators.required]),
      description: new FormControl('', [Validators.required]),
      rentPerDay: new FormControl('', [Validators.required, Validators.min(1)]),
      location: new FormControl('', [Validators.required]),
      imageUrl: new FormControl(''),
    });
  }

  ngOnInit() {
    this.loadAvailableEquipment();
  }

  loadAvailableEquipment() {
    this.rentalService.getAvailableEquipment().subscribe({
      next: (data) => { this.availableEquipment = data; },
      error: (err) => { console.error('Error loading equipment:', err); }
    });
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
        this.equipmentForm.patchValue({ image: this.imageUrl });
      },
      error: (error) => {
        console.error('Cloudinary upload failed', error);
      }
    });
  }


  openAddEquipmentModal() {
    this.isModalOpen = true;
  }

  closeAddEquipmentModal() {
    this.isModalOpen = false;
  }

  submitEquipmentForm() {
    if (this.equipmentForm.valid) {
      this.rentalService.addEquipment(this.equipmentForm.value).subscribe({
        next: () => {
          this.closeAddEquipmentModal();
          this.loadAvailableEquipment();
        },
        error: (err) => { console.error('Error adding equipment:', err); }
      });
    }
  }

  rentEquipment(equipmentId: string) {
    this.rentalService.rentEquipment({ equipmentId }).subscribe({
      next: () => this.loadAvailableEquipment(),
      error: (err) => console.error('Error renting equipment:', err)
    });
  }
}
