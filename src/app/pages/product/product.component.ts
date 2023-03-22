import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { KeycloakService } from 'keycloak-angular';
import { MessageService } from 'primeng/api';
import { catchError, concatMap, tap, throwError } from 'rxjs';
import Product from 'src/app/core/models/product.model';
import { Rating } from 'src/app/core/models/rating.model';
import Sku from 'src/app/core/models/sku.model';
import { FavoriteService } from 'src/app/core/services/favorite.service';
import { ProductService } from 'src/app/core/services/product.service';
import { RatingService } from 'src/app/core/services/rating.service';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss'],
})
export class ProductComponent implements OnInit {
  loading = true;
  isLoggedIn!: boolean;

  private productId!: string;
  private skuCode!: string;

  product!: Product;

  blockPurchase = false;

  SkuData!: Sku;
  otherSkusList: any = [];

  rating: Rating = {
    average: 0,
    count: 0,
    data: [],
  };
  isFavorite = false;
  iconValue = 'pi pi-heart';

  imageSlideConfig = {
    dots: true,
    infinite: true,
    variableWidth: true,
  };

  otherProductSlideConfig = {
    dots: true,
    infinite: false,
    adaptiveheight: true,
    slidesToShow: 3,
    slidesToScroll: 1,
    focusOnSelect: true,
  };

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private productService: ProductService,
    private readonly keycloak: KeycloakService,
    private ratingService: RatingService,
    private favoriteService: FavoriteService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.productId = params['id'];
    });

    this.route.queryParams.subscribe((params) => {
      this.skuCode = params['skuCode'];
      this.loading = true;
      this.loadData();
    });

    this.loadData();
  }

  async loadData() {
    this.isLoggedIn = await this.keycloak.isLoggedIn();

    if (this.skuCode) {
      this.getProductSku(this.skuCode).subscribe({
        next: () => {
          this.loading = false;
        },
        error: (err) => {
          this.openErrorToast(err);
        },
      });
      return;
    }

    this.getProduct().subscribe({
      next: () => {
        if (this.skuCode) {
          this.getProductSku(this.skuCode).subscribe({
            next: () => {
              this.loading = false;
            },
            error: (err) => {
              this.openErrorToast(err);
            },
          });
          return;
        }
        this.SkuData = this.transformProductIntoSku(this.product);
        this.loading = false;
      },
    });
  }

  getProductSku(_skuCode: string) {
    return this.productService.getSku(_skuCode).pipe(
      tap((_skuData) => {
        console.log('dentro do tap getSku');
        this.SkuData = _skuData;
        this.otherSkusList = _skuData.relatedSkus;
      }),
      concatMap((_skuData) =>
        this.ratingService.getProductRating(_skuData.skuCode)
      ),
      tap((_rating) => {
        this.rating = _rating;
        console.log('dentro do tap getProductRating');
      }),
      concatMap(() => {
        return this.favoriteService.getProductUserFavoriteStatus(
          this.SkuData.skuCode
        );
      }),
      tap((isFavorite) => {
        console.log('dentro do tap getProductUserFavoriteStatus');
        this.setFavorite(isFavorite);
      }),
      catchError(() =>
        throwError(() => new Error('Erro ao carregar o conteúdo'))
      )
    );
  }

  getProduct() {
    return this.productService.getProduct(this.productId).pipe(
      tap((_product) => (this.product = _product)),
      concatMap((_product) => this.productService.getSkus(`${_product.id}`)),
      tap((_skuList) => {
        if (_skuList.length > 0) {
          console.log('_skuList ', _skuList);
          this.skuCode = _skuList[0].skuCode;
          return;
        }

        this.blockPurchase = true;
      })
    );
  }

  transformProductIntoSku(value: Product): Sku {
    return {
      mainImageUrl: value.mainImageUrl,
      name: value.name,
      price: {
        listPrice: value.price,
      },
      stockQuantity: 0,
      relatedSkus: [],
      urlImages: [],
      skuCode: '',
      skuAttributes: [],
      product: {
        ...value,
      },
      height: 0,
      length: 0,
      weight: 0,
      width: 0,
    };
  }

  clickFavoriteButton() {
    if (!this.isLoggedIn) {
      return this.keycloak.login();
    }

    if (this.isFavorite)
      return this.favoriteService
        .addProductToFavorite(this.SkuData.skuCode, 'DELETE')
        .subscribe({
          next: () => {
            this.setFavorite(false);
          },
        });

    return this.favoriteService
      .addProductToFavorite(this.SkuData.skuCode, 'POST')
      .subscribe({
        next: () => {
          this.setFavorite(true);
        },
      });
  }

  setFavorite(state: boolean) {
    this.isFavorite = state;
    if (state) {
      this.iconValue = 'pi pi-heart-fill';
      return;
    }
    this.iconValue = 'pi pi-heart';
    return;
  }

  clickBuyButton() {
    this.router.navigate(['/purchase']);
  }

  openErrorToast(msg: string) {
    this.messageService.add({
      severity: 'error',
      summary: 'Erro',
      detail: msg,
      life: 3000,
    });
  }
}
