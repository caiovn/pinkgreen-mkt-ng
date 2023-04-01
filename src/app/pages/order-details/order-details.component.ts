import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { KeycloakService } from 'keycloak-angular';
import { MenuItem } from 'primeng/api';
import Order, { ORDER_STATUS } from 'src/app/core/models/order.model';
import { PaymentMethods } from 'src/app/core/models/product.model';
import { OrderService } from 'src/app/core/services/order.service';

@Component({
  selector: 'app-order-details',
  templateUrl: './order-details.component.html',
  styleUrls: ['./order-details.component.scss'],
})
export class OrderDetailsComponent implements OnInit {
  orderId!: string;
  order!: Order;
  customerId!: string;

  orderHistory: MenuItem[] = [];
  lastOrderHistoryItemIndex!: number;
  activeHistoryOrder!: number;

  regularFlow = [
    'ORDER_CREATED',
    'PAYMENT_CONFIRMED',
    'ORDER_STOCK_RESERVED',
    'ORDER_IN_SEPARATION',
    'ORDER_EN_ROUTE',
    'ORDER_SHIPPED',
  ];

  paymentMethods = PaymentMethods;

  constructor(
    private route: ActivatedRoute,
    private orderService: OrderService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.orderId = params['id'];
    });
    this.loadData();
  }

  loadData() {
    this.orderService.getOrder(this.orderId).subscribe((res) => {
      this.order = res;
      this.loadOrderHistory();
    });
  }

  loadOrderHistory() {
    this.activeHistoryOrder = this.order.history.length - 1;

    const history = this.order.history.map((o) => {
      return { label: ORDER_STATUS[o.status] };
    });

    const futureHistory = this.loadFutureOrderHistory(
      this.order.history[this.activeHistoryOrder].status
    ).map((fo) => {
      return { label: ORDER_STATUS[fo] };
    });

    this.orderHistory = history.concat(futureHistory);
  }

  loadFutureOrderHistory(lastItem: string) {
    console.log(lastItem);
    const reversedRegularFlow = this.regularFlow.slice().reverse();
    const futureFlowIndex = reversedRegularFlow.findIndex((status) => {
      return status === lastItem;
    });

    if (futureFlowIndex != -1) {
      return reversedRegularFlow.splice(0, futureFlowIndex).reverse();
    }

    return [];
  }
}
