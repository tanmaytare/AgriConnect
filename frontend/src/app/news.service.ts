import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NewsService {

  private apiKey = '60f4a84f76c145148aed8cad79ae9e1e';

  constructor(private http: HttpClient) {}

  getAgriNews(query: string = 'agriculture india government scheme', page: number = 1, pageSize: number = 8): Observable<any> {
    const url = `https://newsapi.org/v2/everything?q=${query}&sortBy=publishedAt&pageSize=${pageSize}&page=${page}&apiKey=${this.apiKey}`;
    return this.http.get<any>(url);
  }
}
