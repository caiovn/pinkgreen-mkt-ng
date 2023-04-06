import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { KeycloakService } from 'keycloak-angular';
import { KeycloakProfile } from 'keycloak-js';
import { Observable } from 'rxjs';
import Order from '../models/order.model';

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  private tokenKeycloak!: string;
  private userData!: KeycloakProfile;
  private customerId!: string;
  private url = 'http://localhost:8181';

  constructor(
    private readonly http: HttpClient,
    private readonly keycloak: KeycloakService
  ) {
    this.loadKeycloakData();
  }

  async loadKeycloakData() {
    this.userData = await this.keycloak.loadUserProfile();
    this.customerId = this.userData.id || '';
    this.tokenKeycloak = await this.keycloak.getToken();
  }

  createOrder(orderPayload: any) {
    return this.http.post(`${this.url}/order`, orderPayload, {
      headers: this.mountHeaders(),
    });
  }

  getOrder(orderId: string): Observable<Order> {
    return this.http.get<Order>(`${this.url}/order-administration/order/${orderId}`, {
      headers: this.mountHeaders(),
    });
  }

  getAllUserOrders(customerId: string): Observable<Order[]> {
    return this.http.get<Order[]>(`${this.url}/order/customer/${customerId}`, {
      headers: this.mountHeaders(),
    });
  }

  getAllOrdersAsAdmin(): Observable<Order[]> {
    return this.http.get<Order[]>(`${this.url}/order-administration/order`, {
      headers: this.mountHeaders(),
    });
  }

  getOrderAsAdmin(orderId: string) {
    return this.http.get<Order>(
      `${this.url}/order-administration/order/${orderId}`,
      {
        headers: this.mountHeaders(),
      }
    );
  }

  updateOrderStatus(orderId: string, newStatus: string) {
    return this.http.patch(
      `${this.url}/order-administration/order/${orderId}/update/${newStatus}`,
      null,
      { headers: this.mountHeaders() }
    );
  }

  private mountHeaders() {
    return {
      'Content-type': 'application/json',
      Authorization: `Bearer ${this.tokenKeycloak}`,
    };
  }
}
