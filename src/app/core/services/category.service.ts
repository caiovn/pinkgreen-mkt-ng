import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import Category from '../models/category.model';

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  private url = 'localhost:8181';

  constructor(private readonly http: HttpClient) {}

  getcategories(): Observable<Category[]> {
    return this.http.get<Category[]>(`${this.url}/category`);
  }
}
