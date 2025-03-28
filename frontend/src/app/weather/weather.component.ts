import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { WeatherService } from '../weather.service';
import { FormsModule } from '@angular/forms';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { ChartConfiguration, ChartOptions } from 'chart.js';
import { NgChartsModule } from 'ng2-charts';

@Component({
  selector: 'app-weather',
  standalone: true,
  imports: [FormsModule, CommonModule, NgChartsModule],
  templateUrl: './weather.component.html',
  styleUrls: ['./weather.component.scss']
})
export class WeatherComponent implements OnInit {
  weatherData: any;
  city: string = 'Mumbai';
  loading: boolean = false;

  // Chart Data
  tempChartData: number[] = [];
  humidityChartData: number[] = [];
  windChartData: number[] = [];
  labels: string[] = [];

  public lineChartData: ChartConfiguration<'line'>['data'] = {
    labels: [],
    datasets: [
      {
        data: [],
        label: 'Temperature (°C)',
        borderColor: '#FF5733',
        backgroundColor: 'rgba(255, 87, 51, 0.2)',
        fill: true,
      },
      {
        data: [],
        label: 'Humidity (%)',
        borderColor: '#33A1FF',
        backgroundColor: 'rgba(51, 161, 255, 0.2)',
        fill: true,
      },
      {
        data: [],
        label: 'Wind Speed (m/s)',
        borderColor: '#28A745',
        backgroundColor: 'rgba(40, 167, 69, 0.2)',
        fill: true,
      },
    ],
  };

  public lineChartOptions: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    elements: {
      line: {
        tension: 0.4, // smooth curves
        borderWidth: 2,
      },
      point: {
        radius: 4,
        hoverRadius: 6,
        backgroundColor: '#fff',
        borderWidth: 2,
      }
    },
    scales: {
      x: {
        grid: {
          color: 'rgba(0,0,0,0.05)',
        },
        title: {
          display: true,
          text: 'Time',
          font: {
            size: 14,
            weight: 'bold'
          }
        }
      },
      y: {
        grid: {
          color: 'rgba(0,0,0,0.05)',
        },
        title: {
          display: true,
          text: 'Values',
          font: {
            size: 14,
            weight: 'bold'
          }
        }
      }
    },
    plugins: {
      tooltip: {
        backgroundColor: 'rgba(0,0,0,0.8)',
        titleFont: { size: 14 },
        bodyFont: { size: 12 },
        cornerRadius: 8,
        padding: 10,
      },
      legend: {
        labels: {
          font: {
            size: 12
          },
          boxWidth: 20,
          padding: 15
        }
      }
    }
};


  private intervalId: any;

  constructor(private weatherService: WeatherService, @Inject(PLATFORM_ID) private platformId: Object) {}

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.fetchWeather();
      // ✅ Only set interval in browser
      this.intervalId = setInterval(() => this.fetchWeather(), 50000);
    }
  }

  fetchWeather() {
    this.loading = true;
    this.weatherService.getWeather(this.city).subscribe(
      (data) => {
        this.weatherData = data;
        this.loading = false;

        // ✅ Update arrays immutably for Angular Change Detection
        this.labels = [...this.labels, new Date().toLocaleTimeString()];
        this.tempChartData = [...this.tempChartData, data.main.temp];
        this.humidityChartData = [...this.humidityChartData, data.main.humidity];
        this.windChartData = [...this.windChartData, data.wind.speed];

        // ✅ Keep only last 10 records
        if (this.labels.length > 10) {
          this.labels = this.labels.slice(-10);
          this.tempChartData = this.tempChartData.slice(-10);
          this.humidityChartData = this.humidityChartData.slice(-10);
          this.windChartData = this.windChartData.slice(-10);
        }

        // ✅ Assign fresh arrays to chart (trigger change detection)
        this.lineChartData = {
          labels: [...this.labels],
          datasets: [
            {
              ...this.lineChartData.datasets[0],
              data: [...this.tempChartData],
              borderColor: '#ff6b6b',
              backgroundColor: 'rgba(255, 107, 107, 0.2)',
            },
            {
              ...this.lineChartData.datasets[1],
              data: [...this.humidityChartData],
              borderColor: '#4dabf7',
              backgroundColor: 'rgba(77, 171, 247, 0.2)',
            },
            {
              ...this.lineChartData.datasets[2],
              data: [...this.windChartData],
              borderColor: '#51cf66',
              backgroundColor: 'rgba(81, 207, 102, 0.2)',
            },
          ]
        };
        

      },
      (error) => {
        console.error('Error fetching weather data:', error);
        this.loading = false;
      }
    );
  }

  // ✅ SSR Friendly
  isBrowser() {
    return isPlatformBrowser(this.platformId);
  }

  // ✅ Clean interval when component destroyed
  ngOnDestroy(): void {
    if (this.isBrowser() && this.intervalId) {
      clearInterval(this.intervalId);
    }
  }
}
