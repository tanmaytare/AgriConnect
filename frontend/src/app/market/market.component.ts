import { Component, OnInit } from '@angular/core';
import { MarketPriceService } from '../market.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-market',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './market.component.html',
  styleUrls: ['./market.component.scss']
})
export class MarketComponent implements OnInit {
  marketData: any[] = [];
  filteredData: any[] = [];
  displayedData: any[] = [];
  loading: boolean = false;
  currentPage: number = 1;
  itemsPerPage: number = 10;

  searchTerm: string = '';
  selectedState: string = '';
  selectedMarket: string = '';
  selectedCommodity: string = '';

  sortColumn: string = '';
  sortDirection: boolean = true;

  constructor(private marketService: MarketPriceService) {}

  ngOnInit(): void {
    this.fetchMarketData();
  }

  fetchMarketData() {
    this.loading = true;
    this.marketService.getMarketPrices(0, 100, {}).subscribe(
      (data) => {
        if (data && data.records) {
          this.marketData = data.records;
          this.applyFilters();
        }
        this.loading = false;
      },
      (error) => {
        console.error("Error fetching market prices:", error);
        this.loading = false;
      }
    );
  }

  applyFilters(): void {
    this.filteredData = this.marketData.filter(item => {
      return (
        (!this.selectedState || item.State === this.selectedState) &&
        (!this.selectedMarket || item.Market === this.selectedMarket) &&
        (!this.selectedCommodity || item.Commodity === this.selectedCommodity) &&
        (!this.searchTerm ||
          Object.values(item).some(val =>
            String(val).toLowerCase().includes(this.searchTerm.toLowerCase())
          ))
      );
    });

    this.currentPage = 1;
    this.updateDisplayedData();
  }

  updateDisplayedData() {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    this.displayedData = this.filteredData.slice(start, end);
  }

  changePage(page: number) {
    this.currentPage = page;
    this.updateDisplayedData();
  }

  get totalPages(): number {
    return Math.ceil(this.filteredData.length / this.itemsPerPage);
  }

  sortData(column: string) {
    this.sortDirection = this.sortColumn === column ? !this.sortDirection : true;
    this.sortColumn = column;
    this.filteredData.sort((a, b) =>
      this.sortDirection
        ? String(a[column]).localeCompare(String(b[column]))
        : String(b[column]).localeCompare(String(a[column]))
    );
    this.updateDisplayedData();
  }

  get uniqueStates() { return [...new Set(this.marketData.map(item => item.State))]; }
  get uniqueMarkets() { return [...new Set(this.marketData.map(item => item.Market))]; }
  get uniqueCommodities() { return [...new Set(this.marketData.map(item => item.Commodity))]; }
}
