import { Component, OnInit } from '@angular/core';
import { LaborHiringService } from '../hiring.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-myjobs',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './myjobs.component.html',
  styleUrl: './myjobs.component.scss'
})
export class MyjobsComponent implements OnInit {
  farmerJobs: any = []; // Store jobs posted by the farmer

  constructor(private laborHiringService: LaborHiringService) {}

  ngOnInit() {
    this.fetchFarmerJobs(); // Fetch farmer's jobs when the component is initialized
  }

  // Fetch jobs posted by the farmer
  fetchFarmerJobs() {
    this.laborHiringService.getFarmerJobs().subscribe(
      (jobs) => {
        this.farmerJobs = jobs;
      },
      (error) => {
        console.error('Error fetching farmer jobs:', error);
      }
    );
  }
}