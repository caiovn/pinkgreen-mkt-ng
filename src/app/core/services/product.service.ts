import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import Product from '../models/product.model';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private url = 'http://localhost:8181';

  constructor(private readonly http: HttpClient) {}

  getProductBycategory(id: string): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.url}/product/category/${id}`);
  }
}
