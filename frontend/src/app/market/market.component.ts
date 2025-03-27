import { Component, CUSTOM_ELEMENTS_SCHEMA, OnInit } from '@angular/core';
import { MarketPriceService } from '../market.service';
import { CommonModule } from '@angular/common';
import { NgxPaginationModule } from 'ngx-pagination';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-market',
  standalone: true,
  imports: [CommonModule, NgxPaginationModule, FormsModule],
  templateUrl: './market.component.html',
  styleUrls: ['./market.component.scss'],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class MarketComponent implements OnInit {
  marketData: any[] = [];
  filteredData: any[] = [];
  loading: boolean = false;
  currentPage: number = 1; // Set the initial page to 1
  itemsPerPage: number = 10; // Pagination limit per page
  totalItems: number = 0; // Total number of records for pagination

  searchTerm: string = '';
  selectedState: string = '';
  selectedMarket: string = '';
  selectedCommodity: string = '';
  selectedDistrict: string = '';
  selectedArrivalDate: string = '';

  sortColumn: string = '';
  sortDirection: boolean = true; // true -> ascending, false -> descending

  constructor(private marketService: MarketPriceService) {}

  ngOnInit(): void {
    this.fetchMarketData(); // Fetch data initially
  }

  fetchMarketData() {
    this.loading = true;

    // Create the filters object
    const filters = {
      state: this.selectedState,
      district: this.selectedMarket,
      commodity: this.selectedCommodity,
      arrivalDate: this.selectedArrivalDate
    };

    // Calculate the offset based on the current page
    const offset = (this.currentPage - 1) * this.itemsPerPage;

    // Fetch the market data with pagination
    this.marketService.getMarketPrices(offset, this.itemsPerPage, filters).subscribe(
      (data) => {
        console.log(data);
        if (data && data.records) {
          this.marketData = data.records;
          this.filteredData = [...this.marketData];
          this.totalItems = data.total; // Set the total items for pagination controls
        }
        this.loading = false;
      },
      (error) => {
        console.error("Error fetching market prices:", error);
        this.loading = false;
      }
    );
  }

  // Pagination function to handle page change
  changePage(page: any) {
    this.currentPage = page;
    this.fetchMarketData(); // Re-fetch data when the page changes
  }

  // Filter & Search Function
  applyFilters(selectedValue: string): void {
    console.log(selectedValue);
    this.filteredData = this.marketData.filter(item => {
      return (
        (this.selectedState ? item.State === this.selectedState : true) &&
        (this.selectedMarket ? item.Market === this.selectedMarket : true) &&
        (this.selectedCommodity ? item.Commodity === this.selectedCommodity : true) &&
        (this.selectedDistrict ? item.District === this.selectedDistrict : true) &&
        (this.searchTerm
          ? Object.values(item).some(val =>
              String(val).toLowerCase().includes(this.searchTerm.toLowerCase())
            )
          : true)
      );
    });

    // Reset pagination after applying filters
    this.currentPage = 1;
  }

  // Sorting Function
  sortData(column: string) {
    this.sortDirection = this.sortColumn === column ? !this.sortDirection : true;
    this.sortColumn = column;
    this.filteredData.sort((a, b) => {
      if (typeof a[column] === 'number' && typeof b[column] === 'number') {
        return this.sortDirection ? a[column] - b[column] : b[column] - a[column];
      } else {
        return this.sortDirection
          ? String(a[column]).localeCompare(String(b[column]))
          : String(b[column]).localeCompare(String(a[column]));
      }
    });

    // Reset pagination after sorting
    this.currentPage = 1;
  }

  // Get Unique Values for Filters
  get uniqueStates() {
    return [...new Set(this.marketData.map(item => item.State))];
  }

  get uniqueMarkets() {
    return [...new Set(this.marketData.map(item => item.Market))];
  }

  get uniqueCommodities() {
    return [...new Set(this.marketData.map(item => item.Commodity))];
  }

  get uniqueDistricts() {
    return [...new Set(this.marketData.map(item => item.District))];
  }
}
