import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [RouterLink,CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {
  authService = inject(AuthService);

  userName = "";
  
  ngOnInit() {
    
    this.authService.userName$.subscribe(name => {
      this.userName = name;
    });
  }

  products: any = [
    {
      name: 'Rice - 5kg',
      description: 'High-quality rice from local farms. Perfect for daily meals.',
      price: 500,
      image: 'assets/crop1.jpg',
    },
    {
      name: 'Wheat - 10kg',
      description: 'Premium wheat grains for all your baking and cooking needs.',
      price: 800,
      image: 'assets/crop2.jpg',
    },
    {
      name: 'Organic Fertilizer - 1kg',
      description: 'Boost your crop yield with this all-natural fertilizer.',
      price: 150,
      image: 'assets/crop3.jpg',
    },
    {
      name: 'Tomato Seeds - 500g',
      description: 'High-germination tomato seeds for a bountiful harvest.',
      price: 200,
      image: 'assets/crop4.jpg',
    },
  ];

  equipmentList: any = [
    {
      name: 'Tractor - 10HP',
      description: 'Perfect for plowing fields, this 10HP tractor is ideal for small to medium-sized farms.',
      pricePerDay: 1500,
      image: 'assets/tractor.jpg',
    },
    {
      name: 'Plow - 3-Blade',
      description: 'A heavy-duty 3-blade plow for preparing the land for planting.',
      pricePerDay: 500,
      image: 'assets/plow.jpg',
    },
    {
      name: 'Harvester - Combine',
      description: 'Efficient combine harvester for harvesting crops in less time and with minimal effort.',
      pricePerDay: 3000,
      image: 'assets/harvester.jpg',
    },
    {
      name: 'Sprayer - 50L',
      description: 'Sprayer for applying fertilizers or pesticides, perfect for small and medium-sized crops.',
      pricePerDay: 600,
      image: 'assets/spray.jpg',
    },
  ];

  jobListings: any = [
    {
      title: 'Harvesting Worker',
      description: 'Help with harvesting crops during the season. Work includes cutting, sorting, and packing.',
      dailyWage: 500,
    },
    {
      title: 'Field Preparation',
      description: 'Prepare the land for planting. Includes plowing, fertilizing, and irrigation setup.',
      dailyWage: 400,
    },
    {
      title: 'Planting Worker',
      description: 'Assist with planting crops in the fields, including seed planting and watering.',
      dailyWage: 450,
    },
  ];
}
