import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { KeycloakService } from 'keycloak-angular';
import { Observable } from 'rxjs';
import Product from '../models/product.model';

@Injectable({
  providedIn: 'root',
})
export class CustomerService {
  private tokenKeycloak!: string;
  private url = 'http://localhost:8181';

  constructor(
    private readonly http: HttpClient,
    private readonly keycloak: KeycloakService
  ) {
    this.keycloak.getToken().then((res) => {
      this.tokenKeycloak = res;
    });
  }

  getCustomerIntentions(userId: string): Observable<Product[]> {
    return this.http.get<Product[]>(
      `${this.url}/customer-intentions/${userId}`,
      {
        headers: this.mountHeaders(),
      }
    );
  }

  getCustomerRecentlyViewedProducts(userId: string): Observable<Product[]> {
    return this.http.get<Product[]>(
      `${this.url}/customer-product-access-historical/${userId}`,
      {
        headers: this.mountHeaders(),
      }
    );
  }

  private mountHeaders() {
    return {
      'Content-type': 'application/json',
      Authorization: `Bearer ${this.tokenKeycloak}`,
    };
  }
}
