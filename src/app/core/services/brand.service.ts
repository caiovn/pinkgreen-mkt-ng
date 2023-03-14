import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import Brand from '../models/brand.model';
import Product from '../models/product.model';

@Injectable({
  providedIn: 'root',
})
export class BrandService {
  private url = 'http://localhost:8181';

  constructor(private readonly http: HttpClient) { }

  getBrand(): Observable<Brand[]> {
    return this.http.get<Brand[]>(`${this.url}/brand`);
  }

  getAllProductsByBrandId(id: string): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.url}/product/brand/${id}`)
  }
}
