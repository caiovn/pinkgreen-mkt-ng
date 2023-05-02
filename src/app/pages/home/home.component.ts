import { Component, OnInit } from '@angular/core';
import { KeycloakService } from 'keycloak-angular';
import { MessageService } from 'primeng/api';
import { forkJoin } from 'rxjs';
import Brand from 'src/app/core/models/brand.model';
import Category from 'src/app/core/models/category.model';
import Product from 'src/app/core/models/product.model';
import Sku from 'src/app/core/models/sku.model';
import { BrandService } from 'src/app/core/services/brand.service';
import { CategoryService } from 'src/app/core/services/category.service';
import { CustomerService } from 'src/app/core/services/customer.service';
import { ProductService } from 'src/app/core/services/product.service';
import { SkuService } from 'src/app/core/services/sku.service';

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
  skuListMostSelled!: Sku[];

  recommendedProductsList: Product[] = [];
  recentlyViewedProductList: Product[] = [];

  slideConfig = {
    dots: false,
    infinite: false,
    variableWidth: true,
    arrows: true,
    responsive: [
      {
        breakpoint: 769,
        settings: {
          arrows: false,
        },
      },
    ],
  };

  constructor(
    private readonly categoryService: CategoryService,
    private readonly brandService: BrandService,
    private messageService: MessageService,
    private productService: ProductService,
    private skuService: SkuService,
    private customerService: CustomerService,
    private keycloakService: KeycloakService
  ) {}

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    const brand$ = this.brandService.getBrands();
    const category$ = this.categoryService.getcategories();
    const product$ = this.productService.getProducts();
    const skuMostSelled$ = this.skuService.getProductsMostSelled();

    this.keycloakService.isLoggedIn().then((res) => {
      if (res) {
        this.keycloakService.loadUserProfile().then((userData) => {
          const customerIntentions$ =
            this.customerService.getCustomerIntentions(userData.id || '');

          const customerRecentlyViewed$ =
            this.customerService.getCustomerRecentlyViewedProducts(
              userData.id || ''
            );

          forkJoin([customerIntentions$, customerRecentlyViewed$]).subscribe({
            next: (res) => {
              this.recommendedProductsList = res[0];
              this.recentlyViewedProductList = res[1];
            },
          });
        });
      }
    });

    forkJoin([category$, brand$, product$, skuMostSelled$]).subscribe({
      next: (results) => {
        this.categoryList = results[0];
        this.brandList = results[1];
        this.productsList = results[2];
        this.skuListMostSelled = results[3];
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
