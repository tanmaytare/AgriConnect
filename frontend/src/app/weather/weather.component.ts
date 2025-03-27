import { Component, OnInit } from '@angular/core';
import { WeatherService } from '../weather.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-weather',
  standalone: true,
  imports: [FormsModule,CommonModule],
  templateUrl: './weather.component.html',
  styleUrl: './weather.component.scss'
})
export class WeatherComponent implements OnInit {
  weatherData: any;
  city: string = 'Mumbai';
  loading: boolean = false;

  constructor(private weatherService: WeatherService) {}

  ngOnInit(): void {
    this.fetchWeather();
    if (typeof window !== 'undefined') { // Ensure it runs only on client-side
      setTimeout(() => {
        this.fetchWeather();
      }, 50000); // Fetch every 50 seconds
    }
  }
    

  fetchWeather() {
    this.loading = true;
    this.weatherService.getWeather(this.city).subscribe(
      (data) => {
        this.weatherData = data;
        this.loading = false;
      },
      (error) => {
        console.error('Error fetching weather data:', error);
        this.weatherData = { error: 'Failed to fetch weather' }; // Prevent infinite loop
        this.loading = false;
      }
    );
  }
}