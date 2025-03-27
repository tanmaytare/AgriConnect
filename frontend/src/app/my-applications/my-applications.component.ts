import { Component, OnInit } from '@angular/core';
import { LaborHiringService } from '../hiring.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-my-applications',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './my-applications.component.html',
  styleUrl: './my-applications.component.scss'
})
export class MyApplicationsComponent implements OnInit {
  workerApplications: any = []; // Store jobs applied by the worker

  constructor(private laborHiringService: LaborHiringService) {}

  ngOnInit() {
    this.fetchWorkerApplications(); // Fetch worker's applications when the component is initialized
  }

  // Fetch jobs applied by the worker
  fetchWorkerApplications() {
    this.laborHiringService.getWorkerApplications().subscribe(
      (jobs) => {
        this.workerApplications = jobs;
      },
      (error) => {
        console.error('Error fetching worker applications:', error);
      }
    );
  }
}