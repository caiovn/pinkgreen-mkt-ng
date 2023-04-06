import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import Brand from '../models/brand.model';
import Product from '../models/product.model';
import { KeycloakService } from 'keycloak-angular';

@Injectable({
  providedIn: 'root',
})
export class BrandService {
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

  getBrands(): Observable<Brand[]> {
    return this.http.get<Brand[]>(`${this.url}/brand`);
  }

  getBrand(brandId: string): Observable<Brand> {
    return this.http.get<Brand>(`${this.url}/brand/${brandId}`);
  }

  getAllProductsByBrandId(id: string): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.url}/product/brand/${id}`);
  }

  deleteBrandById(id: string): Observable<void> {
    return this.http.delete<void>(`${this.url}/brand-administration/brand/${id}`);
  }

  createBrand(brand: Brand) {
    return this.http.post(`${this.url}/brand-administration/brand`, brand, {
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
