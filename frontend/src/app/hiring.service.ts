import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LaborHiringService {
  private apiUrl = 'http://localhost:5000/job'; // Change this if needed

  constructor(private http: HttpClient) {}

  // Farmer: Post a new job
  postJob(jobData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/jobs`, jobData);
  }

  // Get all jobs
  getJobs(): Observable<any> {
    return this.http.get(`${this.apiUrl}/jobs`);
  }

  // Worker: Register as a worker
  registerWorker(workerData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/workers/register`, workerData);
  }

  // Worker: Apply for a job
  applyForJob(jobId: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/jobs/apply/${jobId}`, {});
  }

  // Farmer: Get jobs posted by the current user
  getFarmerJobs(): Observable<any> {
    return this.http.get(`${this.apiUrl}/jobs/my-jobs`);
  }

  // Farmer: Get applications for a job
  getJobApplications(jobId: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/jobs/${jobId}/applications`);
  }

  // Farmer: Hire a worker
  hireWorker(jobId: string, workerId: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/jobs/${jobId}/hire/${workerId}`, {});
  }

  // In labor-hiring.service.ts
getWorkerStatus(): Observable<any> {
  return this.http.get(`${this.apiUrl}/workers/status`);
}

getWorkerApplications(): Observable<any> {
  return this.http.get(`${this.apiUrl}/jobs/my-applications`);
}


}
