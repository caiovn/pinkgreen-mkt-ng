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
}
