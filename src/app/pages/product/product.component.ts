import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { KeycloakService } from 'keycloak-angular';
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

  productsList: Sku[] = [];
  productData!: Sku;
  otherProductsList: any = [];

  rating!: Rating;
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
    private productService: ProductService,
    private readonly keycloak: KeycloakService,
    private ratingService: RatingService,
    private favoriteService: FavoriteService
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

  loadData() {
    const callback = () => {
      this.ratingService.getProductRating(this.productData.skuCode).subscribe({
        next: (res) => {
          this.rating = res;
        },
      });

      if (this.isLoggedIn) {
        this.favoriteService
          .getProductUserFavoriteStatus(this.productData.skuCode)
          .subscribe({
            next: (res) => {
              this.setFavorite(true);
              this.loading = false;
              console.log('fav status', res);
            },
            error: (err) => {
              this.setFavorite(false);
              this.loading = false;
              console.log('fav err', err);
            },
          });
      }
    };

    this.keycloak.isLoggedIn().then((res) => {
      this.isLoggedIn = res;
      if (this.skuCode) {
        this.productService.getProductSku(this.skuCode).subscribe({
          next: (res) => {
            console.log(res);
            this.productData = res;
            this.otherProductsList = res.relatedSkus;

            callback();
          },
        });
      } else {
        this.productService.getProductSKUs(this.productId).subscribe({
          next: (res) => {
            this.productsList = res;
            this.productData = this.productsList[0];

            this.otherProductsList = this.productsList.slice(1);

            callback();
          },
        });
      }
    });
  }

  clickFavoriteButton() {
    if (!this.isLoggedIn) {
      return this.keycloak.login();
    }

    if (this.isFavorite)
      return this.favoriteService
        .addProductToFavorite(this.productData.skuCode, 'DELETE')
        .subscribe({
          next: () => {
            this.setFavorite(false);
          },
        });

    return this.favoriteService
      .addProductToFavorite(this.productData.skuCode, 'POST')
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
}
