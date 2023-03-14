import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import Product from '../models/product.model';

@Injectable({
  providedIn: 'root'
})
export class SearchService {

  private url = 'http://localhost:8181';

  constructor(private readonly http: HttpClient) { }

  searchProductByText(text: string): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.url}/product/search?text=${text}`);
  }
}
