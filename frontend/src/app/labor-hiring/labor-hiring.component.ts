import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'; // Import ReactiveFormsModule
import { LaborHiringService } from '../hiring.service';
import { FormGroup, FormControl, Validators } from '@angular/forms'; // Import Reactive Form classes
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-labor-hiring',
  standalone: true,
  imports: [FormsModule, CommonModule, ReactiveFormsModule,RouterLink], // Add ReactiveFormsModule
  templateUrl: './labor-hiring.component.html',
  styleUrls: ['./labor-hiring.component.scss']
})
export class LaborHiringComponent implements OnInit {
  isWorker: boolean = false; // Determines if the user is a worker
  isWorkerModalOpen: boolean = false; // Controls worker registration modal visibility
  isModalOpen: boolean = false;
  jobListings: any = [];

  // Reactive form declarations
  newJobForm: FormGroup;
  workerRegistrationForm: FormGroup;

  constructor(private laborHiringService: LaborHiringService) {
    // Initialize the forms
    this.newJobForm = new FormGroup({
      title: new FormControl('', [Validators.required]),
      description: new FormControl('', [Validators.required]),
      location: new FormControl('', [Validators.required]),
      wage: new FormControl(0, [Validators.required, Validators.min(1)]),
    });

    this.workerRegistrationForm = new FormGroup({
      skills: new FormControl('', [Validators.required]),
      experience: new FormControl(0, [Validators.required, Validators.min(1)]),
      location: new FormControl('', [Validators.required]),
    });
  }

  ngOnInit() {
    this.fetchJobs();
    this.checkWorkerStatus();
  }

  checkWorkerStatus() {
    this.laborHiringService.getWorkerStatus().subscribe(
      (response) => {
        this.isWorker = response.isWorker;
      },
      (error) => {
        console.error('Error checking worker status:', error);
      }
    );
  }

  fetchJobs() {
    this.laborHiringService.getJobs().subscribe(
      (jobs) => {
        this.jobListings = jobs;
      },
      (error) => {
        console.error('Error fetching jobs:', error);
      }
    );
  }

  // Open worker registration modal
  openWorkerModal() {
    this.isWorkerModalOpen = true;
  }

  // Close worker registration modal
  closeWorkerModal() {
    this.isWorkerModalOpen = false;
  }

  // Open the modal
  openSellProductModal(): void {
    this.isModalOpen = true;
  }

  // Close the modal
  closeSellProductModal(): void {
    this.isModalOpen = false;
  }

  // Register as a worker
  registerWorker() {
  if (this.workerRegistrationForm.valid) {
    this.laborHiringService.registerWorker(this.workerRegistrationForm.value).subscribe(
      (response) => {
        alert('Registration successful');
        this.isWorker = true; // After registration, the user is a worker
        this.closeWorkerModal();
      },
      (error) => {
        alert('Error registering as worker');
      }
    );
  }
}


  // Apply for a job
  applyForJob(job: any) {
    if (!this.isWorker) {
      alert('Please register as a worker before applying for jobs.');
      return;
    }
    this.laborHiringService.applyForJob(job._id).subscribe(
      (response) => {
        alert('Applied successfully!');
        // Optionally, update UI state (e.g., disable the Apply button)
      },
      (error) => {
        alert('Error applying for job');
      }
    );
  }

  postJob() {
    if (this.newJobForm.valid) {
      this.laborHiringService.postJob(this.newJobForm.value).subscribe(
        (response) => {
          alert('Job posted successfully!');
          this.isModalOpen = false;
          this.newJobForm.reset(); // Reset form
          this.fetchJobs(); // Refresh job list
        },
        (error) => {
          alert('Error posting job');
        }
      );
    }
  }

}
