import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { KeycloakService } from 'keycloak-angular';
import { Observable } from 'rxjs';
import { Rating } from '../models/rating.model';

@Injectable({
  providedIn: 'root',
})
export class RatingService {
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

  getProductRating(skuCode: string): Observable<Rating> {
    return this.http.get<Rating>(`${this.url}/evaluations/product/${skuCode}`, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  createProductRating(
    orderId: string,
    skuCode: string,
    stars: number,
    title: string,
    comment: string
  ) {
    console.log("meopooo", orderId, skuCode, stars, title,comment)
    return this.http.post(
      `${this.url}/evaluations/order/${orderId}/product/${skuCode}`,
      {
        stars,
        title,
        evaluation: comment,
      },
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
