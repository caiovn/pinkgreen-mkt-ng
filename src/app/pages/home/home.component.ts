import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { forkJoin } from 'rxjs';
import Brand from 'src/app/core/models/brand.model';
import Category from 'src/app/core/models/category.model';
import Product from 'src/app/core/models/product.model';
import { BrandService } from 'src/app/core/services/brand.service';
import { CategoryService } from 'src/app/core/services/category.service';
import { ProductService } from 'src/app/core/services/product.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  loading = true;
  categoryList!: Category[];
  brandList!: Brand[];
  productsList!: Product[];

  slideConfig = {
    dots: false,
    infinite: false,
    variableWidth: true,
    arrows: true,
    responsive: [
      {
        breakpoint: 769,
        settings: {
          arrows: false
        },
      },
    ],
  };

  constructor(
    private readonly categoryService: CategoryService,
    private readonly brandService: BrandService,
    private messageService: MessageService,
    private productService: ProductService,
  ) {}

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    const brand$ = this.brandService.getBrands();
    const category$ = this.categoryService.getcategories();
    const product$ = this.productService.getProducts();

    forkJoin([category$, brand$, product$]).subscribe({
      next: (results) => {
        this.categoryList = results[0];
        this.brandList = results[1];
        this.productsList = results[2];
        this.loading = false;
      },
      error: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Erro',
          detail: 'Erro ao carregar o conteúdo.',
          life: 3000,
        });
        this.loading = false;
      },
      complete: () => {
        this.loading = false;
      },
    });
  }

  getImageUrl(imageUrl: string) {
    return `url(${imageUrl})`;
  }
}
