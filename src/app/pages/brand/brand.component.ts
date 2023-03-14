import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { forkJoin } from 'rxjs';
import Product from 'src/app/core/models/product.model';
import { BrandService } from 'src/app/core/services/brand.service';

@Component({
  selector: 'app-brand',
  templateUrl: './brand.component.html',
  styleUrls: ['./brand.component.scss']
})
export class BrandComponent implements OnInit {

  brandId!: string;
  brandName!: string;
  productList!: Product[];

  constructor(
    private route: ActivatedRoute,
    private brandService: BrandService
  ) { }

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.brandId = params['id'];
      this.brandName = params['name'];
    });

    this.loadData();
  }

  loadData(): void {
    const products$ = this.brandService.getAllProductsByBrandId(this.brandId);

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
