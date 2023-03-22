import { Component, OnInit } from '@angular/core';
import { KeycloakService } from 'keycloak-angular';
import { forkJoin } from 'rxjs';
import Sku from 'src/app/core/models/sku.model';
import { FavoriteService } from 'src/app/core/services/favorite.service';

@Component({
  selector: 'app-favorites',
  templateUrl: './favorites.component.html',
  styleUrls: ['./favorites.component.scss']
})
export class FavoritesComponent implements OnInit {

  isLoggedIn!: boolean;
  isFavorite = false;

  SkuData!: Sku;
  favoriteProductList!: Sku[];

  constructor(
    private readonly keycloak: KeycloakService,
    private favoriteProductService: FavoriteService
  ) {
  }

  async ngOnInit(): Promise<void> {
    this.isLoggedIn = await this.keycloak.isLoggedIn();

    if (!this.isLoggedIn)
      return this.keycloak.login();

    await this.loadData();
  }

  async loadData() {
    const sku$ = await this.favoriteProductService.getAllFavoriteProductsByUser();

    forkJoin([sku$]).subscribe({
      next: (results) => {
        console.log(results);
        this.favoriteProductList = results[0];
      },
    });
  }

  getImageUrl(imageUrl: string) {
    return `url(${imageUrl})`;
  }
}
