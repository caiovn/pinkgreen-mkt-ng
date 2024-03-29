import { Component } from '@angular/core';
import { KeycloakService } from 'keycloak-angular';
import OrderStatus from 'src/app/core/enums/order-status.enum';
import Order from 'src/app/core/models/order.model';
import { OrderService } from 'src/app/core/services/order.service';

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.scss'],
})
export class OrderComponent {
  orders!: Order[];

  cancelledOrders!: Order[];

  finishedOrders!: Order[];

  customerId!: string;

  constructor(
    private orderService: OrderService,
    private keycloak: KeycloakService
  ) {
    this.keycloak.loadUserProfile().then((res) => {
      this.customerId = res.id || '';
      this.loadData();
    });
  }

  getImageUrl(imageUrl: string) {
    return `url(${imageUrl})`;
  }

  loadData() {
    this.orderService.getAllUserOrders(this.customerId).subscribe({
      next: (res) => {
        this.orders = res.filter(
          (order) =>
            order.status !== 'ORDER_CANCELED' &&
            order.status !== 'ORDER_SHIPPED'
        );

        this.cancelledOrders = res.filter(order => order.status === 'ORDER_CANCELED');

        this.finishedOrders = res.filter(order => order.status === 'ORDER_SHIPPED')
      },
    });
  }
}
