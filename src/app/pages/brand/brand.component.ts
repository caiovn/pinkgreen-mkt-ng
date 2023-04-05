import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { forkJoin } from 'rxjs';
import Brand from 'src/app/core/models/brand.model';
import Product from 'src/app/core/models/product.model';
import { BrandService } from 'src/app/core/services/brand.service';

@Component({
  selector: 'app-brand',
  templateUrl: './brand.component.html',
  styleUrls: ['./brand.component.scss'],
})
export class BrandComponent implements OnInit {
  loading = true;
  brandId!: string;

  brand!: Brand;
  productList!: Product[];

  constructor(
    private route: ActivatedRoute,
    private brandService: BrandService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.brandId = params['id'];
    });

    this.loadData();
  }

  loadData(): void {
    const brand$ = this.brandService.getBrand(this.brandId);
    const products$ = this.brandService.getAllProductsByBrandId(this.brandId);

    forkJoin([products$, brand$]).subscribe({
      next: (results) => {
        this.productList = results[0];
        this.brand = results[1];
        this.loading = false;
      },
    });
  }

  getImageUrl(imageUrl: string) {
    return `url(${imageUrl})`;
  }
}
