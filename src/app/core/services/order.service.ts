import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  private url = 'http://localhost:8181';

  constructor(private http: HttpClient) {}

  createOrder(orderPayload: any) {
    return this.http.post(`${this.url}/order`, orderPayload, {
      headers: {
        'Content-type': 'application/json',
        Authorization: orderPayload.customerId,
      },
    });
  }
}
