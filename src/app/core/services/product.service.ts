import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import Product from '../models/product.model';
import Sku from '../models/sku.model';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private url = 'http://localhost:8181';

  constructor(private readonly http: HttpClient) {}

  getProductsBycategory(id: string): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.url}/product/category/${id}`);
  }

  getProductSKUs(id: string): Observable<Sku[]> {
    return this.http.get<Sku[]>(`${this.url}/sku/product_skus/${id}`);
  }

  getProductSku(skuCode: string): Observable<Sku> {
    return this.http.get<Sku>(`${this.url}/sku/${skuCode}`);
  }
}
