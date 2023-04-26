import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { KeycloakService } from 'keycloak-angular';
import { Observable } from 'rxjs';
import Sku from '../models/sku.model';
import Product from '../models/product.model';

@Injectable({
  providedIn: 'root',
})
export class SkuService {
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

  getSkus(id: string): Observable<Sku[]> {
    return this.http.get<Sku[]>(`${this.url}/sku/product_skus/${id}`);
  }

  getSku(skuCode: string): Observable<Sku> {
    return this.http.get<Sku>(`${this.url}/sku/${skuCode}`);
  }

  getProductsMostSelled(): Observable<Sku[]> {
    return this.http.get<Sku[]>(`${this.url}/sku/most-selled`);
  }

  getSkusAsAdmin(id: string): Observable<Sku[]> {
    return this.http.get<Sku[]>(
      `${this.url}/sku-administration/sku/product/${id}`
    );
  }

  createSku(skuPayload: Sku) {
    return this.http.post(`${this.url}/sku-administration/sku`, skuPayload, {
      headers: this.mountHeaders(),
    });
  }

  updateSku(skuCode: string, skuPayload: Sku) {
    return this.http.put(
      `${this.url}/sku-administration/sku/${skuCode}`,
      skuPayload,
      {
        headers: this.mountHeaders(),
      }
    );
  }

  deleteSku(skuCode: string) {
    return this.http.delete(`${this.url}/sku-administration/sku/${skuCode}`, {
      headers: this.mountHeaders(),
    });
  }

  private mountHeaders() {
    return {
      'Content-type': 'application/json',
      Authorization: `Bearer ${this.tokenKeycloak}`,
    };
  }
}
