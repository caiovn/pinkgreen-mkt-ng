import { Component, OnInit } from '@angular/core';
import { KeycloakService } from 'keycloak-angular';
import { forkJoin } from 'rxjs';
import Sku from 'src/app/core/models/sku.model';
import { FavoriteService } from 'src/app/core/services/favorite.service';

@Component({
  selector: 'app-favorites',
  templateUrl: './favorites.component.html',
  styleUrls: ['./favorites.component.scss'],
})
export class FavoritesComponent implements OnInit {
  loading = true;
  customerId!: string;

  isLoggedIn!: boolean;
  isFavorite = false;

  SkuData!: Sku;
  favoriteProductList!: Sku[];

  constructor(
    private readonly keycloak: KeycloakService,
    private favoriteProductService: FavoriteService
  ) {}

  ngOnInit() {
    this.keycloak.loadUserProfile().then((user) => {
      this.customerId = user.id || '';
      this.loadData();
    });
  }

  loadData() {
    this.favoriteProductService
      .getAllFavoriteProductsByUser(this.customerId)
      .subscribe({
        next: (results) => {
          this.favoriteProductList = results;
          this.loading = false;
        },
        error: () => {
          this.loading = false;
        },
      });
  }

  getImageUrl(imageUrl: string) {
    return `url(${imageUrl})`;
  }
}
