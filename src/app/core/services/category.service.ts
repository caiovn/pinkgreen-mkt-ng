import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import Category from '../models/category.model';
import { KeycloakService } from 'keycloak-angular';

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  private url = 'http://localhost:8181';
  private tokenKeycloak!: string;

  constructor(
    private readonly http: HttpClient,
    private readonly keycloak: KeycloakService
  ) {
    this.keycloak.getToken().then((res) => {
      this.tokenKeycloak = res;
    });
  }

  private mountHeaders() {
    return {
      'Content-type': 'application/json',
      Authorization: `Bearer ${this.tokenKeycloak}`,
    };
  }

  getcategories(): Observable<Category[]> {
    return this.http.get<Category[]>(`${this.url}/category`);
  }

  getCategoryById(id: string): Observable<Category> {
    return this.http.get<Category>(`${this.url}/category/${id}`);
  }

  createCategory(category: Category) {
    return this.http.post(`${this.url}/category`, category, {
      headers: this.mountHeaders(),
    });
  }
}
