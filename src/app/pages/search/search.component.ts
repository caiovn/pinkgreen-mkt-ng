import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { forkJoin } from 'rxjs';
import Product from 'src/app/core/models/product.model';
import { SearchService } from 'src/app/core/services/search.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss'],
})
export class SearchComponent implements OnInit {
  searchTerm!: string;
  productList!: Product[];

  constructor(
    private route: ActivatedRoute,
    private searchService: SearchService
  ) { }

  ngOnInit() {
    this.route.queryParams.subscribe((params) => {
      this.searchTerm = params['searchTerm'];
      this.loadData();
    });
  }

  loadData(): void {
    const products$ = this.searchService.searchProductByText(this.searchTerm);

    forkJoin([products$]).subscribe({
      next: (results) => {
        this.productList = results[0];
      },
    });
  }

  getImageUrl(imageUrl: string) {
    return `url(${imageUrl})`;
  }
}