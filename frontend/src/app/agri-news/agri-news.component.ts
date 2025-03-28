import { Component, OnInit } from '@angular/core';
import { NewsService } from '../news.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-agri-news',
  standalone: true,
  imports: [CommonModule,FormsModule],
  templateUrl: './agri-news.component.html',
  styleUrl: './agri-news.component.scss'
})
export class AgriNewsComponent implements OnInit {

  newsList: any[] = [];
  query: string = 'agriculture india government scheme';
  page: number = 1;
  totalResults: number = 0;

  categories: string[] = ['All', 'Schemes', 'Policies', 'Agri-Tech', 'Market Trends'];

  constructor(private agriNewsService: NewsService) {}

  ngOnInit(): void {
    this.getNews();
  }

  getNews() {
    this.agriNewsService.getAgriNews(this.query, this.page, 8).subscribe(response => {
      console.log(response);
      this.newsList = response.articles;
      this.totalResults = response.totalResults;
    });
  }

  nextPage() {
    this.page++;
    this.getNews();
  }

  prevPage() {
    if (this.page > 1) {
      this.page--;
      this.getNews();
    }
  }

  searchNews(event: any) {
    this.page = 1;
    this.getNews();
  }

  filterByCategory(category: string) {
    this.page = 1;
    if (category === 'All') {
      this.query = 'agriculture india government scheme';
    } else if (category === 'Schemes') {
      this.query = 'agriculture government schemes india';
    } else if (category === 'Policies') {
      this.query = 'agriculture policies india';
    } else if (category === 'Agri-Tech') {
      this.query = 'agriculture technology india';
    } else if (category === 'Market Trends') {
      this.query = 'agriculture market trends india';
    }
    this.getNews();
  }
}
