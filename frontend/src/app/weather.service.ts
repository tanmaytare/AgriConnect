import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WeatherService {
  private API_KEY = '8b25d314ab16e3cb265ad01923220cf6';
  private API_URL = 'https://api.openweathermap.org/data/2.5/weather';

  constructor(private http: HttpClient) {}

  getWeather(city: string): Observable<any> {
    return this.http.get(`${this.API_URL}?q=${city}&appid=${this.API_KEY}&units=metric`);
  }
}
