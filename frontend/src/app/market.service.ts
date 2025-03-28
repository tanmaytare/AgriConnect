import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MarketPriceService {
  private apiUrl = 'https://api.data.gov.in/resource/35985678-0d79-46b4-9ed6-6f13308a1d24';

  constructor(private http: HttpClient) {}

  getMarketPrices(offset: number, limit: number, filters: any): Observable<any> {
    let params = new HttpParams()
      .set('api-key', '579b464db66ec23bdd000001379294277c934cf873ffac2373dfc149')
      .set('format', 'json')
      .set('offset', offset.toString())
      .set('limit', limit.toString());
  
    // Apply filters if any
    if (filters.state) params = params.set('filters[State.keyword]', filters.state);
    if (filters.district) params = params.set('filters[District.keyword]', filters.district);
    if (filters.commodity) params = params.set('filters[Commodity.keyword]', filters.commodity);
    if (filters.arrivalDate) params = params.set('filters[Arrival_Date]', filters.arrivalDate);
  
    return this.http.get<any>(this.apiUrl, { params });
  }
  
}
