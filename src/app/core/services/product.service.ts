import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { KeycloakService } from 'keycloak-angular';
import { Observable } from 'rxjs';
import Product from '../models/product.model';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private tokenKeycloak = '';
  private url = 'http://localhost:8181';

  constructor(
    private readonly http: HttpClient,
    private readonly keycloak: KeycloakService
  ) {
    this.keycloak.getToken().then((res) => {
      this.tokenKeycloak = res;
    });
  }

  getProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.url}/product`);
  }

  getProduct(id: string, customerId = ''): Observable<Product> {
    console.log('erssse daqui', customerId);

    console.log(this.mountHeaders(customerId));

    return this.http.get<Product>(`${this.url}/product/${id}`, {
      headers: this.mountHeaders(customerId),
    });
  }

  getProductsBycategory(id: string): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.url}/product/category/${id}`);
  }

  deleteProductById(id: string): Observable<void> {
    return this.http.delete<void>(
      `${this.url}/product-administration/product/${id}`
    );
  }

  createProduct(product: Product) {
    return this.http.post(
      `${this.url}/product-administration/product`,
      product,
      { headers: this.mountHeaders(), observe: 'response' }
    );
  }

  updateProduct(productId: string, product: Product) {
    return this.http.put(
      `${this.url}/product-administration/product/${productId}`,
      product,
      { headers: this.mountHeaders() }
    );
  }

  getProductAsAdmin(productId: string): Observable<Product> {
    return this.http.get<Product>(
      `${this.url}/product-administration/product/${productId}`
    );
  }

  getProductsAsAdmin(): Observable<Product[]> {
    return this.http.get<Product[]>(
      `${this.url}/product-administration/product`
    );
  }

  private mountHeaders(customerId = '') {
    return {
      'Content-type': 'application/json',
      ...(this.tokenKeycloak && {
        Authorization: `Bearer ${this.tokenKeycloak}`,
      }),
      ...(customerId && { customerId: customerId }),
    };
  }
}
