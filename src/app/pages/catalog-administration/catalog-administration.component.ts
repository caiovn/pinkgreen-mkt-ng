import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { forkJoin } from 'rxjs';
import Brand from 'src/app/core/models/brand.model';
import Category from 'src/app/core/models/category.model';
import Product from 'src/app/core/models/product.model';
import { BrandService } from 'src/app/core/services/brand.service';
import { CategoryService } from 'src/app/core/services/category.service';
import { ProductService } from 'src/app/core/services/product.service';

@Component({
  selector: 'app-catalog-administration',
  templateUrl: './catalog-administration.component.html',
  styleUrls: ['./catalog-administration.component.scss'],
})
export class CatalogAdministrationComponent implements OnInit {
  loading = true;
  brands!: Brand[];
  categories!: Category[];
  products!: Product[];

  constructor(
    private brandService: BrandService,
    private categoryService: CategoryService,
    private productService: ProductService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const brand$ = this.brandService.getBrands();
    const categories$ = this.categoryService.getcategories();
    const products$ = this.productService.getProducts();

    forkJoin([brand$, categories$, products$]).subscribe({
      next: (res) => {
        this.brands = res[0];
        this.categories = res[1];
        this.products = res[2];
        this.loading = false;
      },
    });
  }

  openBrandPage(brandId = '') {
    this.router.navigate([
      '/catalog-administration/brand',
      brandId ? brandId : '',
    ]);
  }
}
