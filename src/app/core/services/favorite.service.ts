import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { KeycloakService } from 'keycloak-angular';

@Injectable({
  providedIn: 'root',
})
export class FavoriteService {
  private tokenKeycloak!: string;
  private userId!: string;
  private url = 'http://localhost:8181';

  constructor(
    private readonly http: HttpClient,
    private readonly keycloak: KeycloakService
  ) {
    this.keycloak.loadUserProfile().then((res) => {
      this.userId = res.id || '';
    });
    this.keycloak.getToken().then((res) => {
      this.tokenKeycloak = res;
    });
  }

  getProductUserFavoriteStatus(skuCode: string) {
    return this.http.get(
      `${this.url}/favorite/product/${skuCode}/user/${this.userId}`
    );
  }

  addProductToFavorite(skuCode: string, operation: 'POST' | 'DELETE') {
    if (operation === 'POST') {
      return this.http.post(
        `${this.url}/favorite/product/${skuCode}/user/${this.userId}`,
        null,
        { headers: { Authorization: `Bearer ${this.tokenKeycloak}` } }
      );
    }

    return this.http.delete(
      `${this.url}/favorite/product/${skuCode}/user/${this.userId}`,
      { headers: { Authorization: `Bearer ${this.tokenKeycloak}` } }
    );
  }
}
