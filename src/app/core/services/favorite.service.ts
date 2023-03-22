import { HttpClient } from '@angular/common/http';
import { Injectable, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { KeycloakService } from 'keycloak-angular';
import { KeycloakProfile } from 'keycloak-js';
import { Observable, Subscription } from 'rxjs';
import Sku from '../models/sku.model';

@Injectable({
  providedIn: 'root',
})
export class FavoriteService implements OnDestroy {
  private subscription = new Subscription();
  private tokenKeycloak!: string;
  private userData!: KeycloakProfile;
  private url = 'http://localhost:8181';

  constructor(
    private readonly http: HttpClient,
    private readonly keycloak: KeycloakService,
    private router: Router
  ) {
    this.loadKeycloakData();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  async loadKeycloakData() {
    this.userData = await this.keycloak.loadUserProfile();
    this.tokenKeycloak = await this.keycloak.getToken();
  }

  getProductUserFavoriteStatus(skuCode: string): Observable<boolean> {
    return new Observable((observer) => {
      const endpoint = `${this.url}/favorite/product/${skuCode}/user/${this.userData?.id}`;

      this.subscription.add(
        this.http.get(endpoint).subscribe({
          next: () => {
            observer.next(true);
          },
          error: () => {
            observer.next(false);
          },
        })
      );
    });
  }

  async getAllFavoriteProductsByUser(): Promise<Observable<Sku[]>> {
    if (!this.userData)
      this.router.navigate(['/home']);

    return this.http.get<Sku[]>(`${this.url}/favorite/user/${this.userData?.id}`)
  }

  addProductToFavorite(skuCode: string, operation: 'POST' | 'DELETE') {
    const endpoint = `${this.url}/favorite/product/${skuCode}/user/${this.userData.id}`;

    if (operation === 'POST') {
      return this.http.post(endpoint, null, { headers: this.mountHeaders() });
    }

    return this.http.delete(endpoint, { headers: this.mountHeaders() });
  }

  mountHeaders() {
    return {
      Authorizarion: `Bearer ${this.userData.id}`,
    };
  }
}
