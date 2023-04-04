import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { KeycloakService } from 'keycloak-angular';
import { KeycloakProfile } from 'keycloak-js';
import { MenuItem, MessageService } from 'primeng/api';
import Order, { ORDER_STATUS_TEXT } from 'src/app/core/models/order.model';
import { PaymentMethods } from 'src/app/core/models/product.model';
import { OrderService } from 'src/app/core/services/order.service';

@Component({
  selector: 'app-order-administration-details',
  templateUrl: './order-administration-details.component.html',
  styleUrls: ['./order-administration-details.component.scss'],
})
export class OrderAdministrationDetailsComponent implements OnInit {
  form!: FormGroup;
  loading = true;

  orderId!: string;
  order!: Order;

  customerData!: KeycloakProfile;

  actualOrderStatus!: string;
  nextOrderStatus!: string;

  orderHistory: MenuItem[] = [];
  activeHistoryOrder!: number;

  ORDER_STATUS_TEXT = ORDER_STATUS_TEXT;

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
    private orderService: OrderService,
    private keycloak: KeycloakService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.orderId = params['id'];
    });
    this.loadData();
  }

  loadData() {
    this.keycloak.loadUserProfile().then((res) => {
      this.customerData = res;
      return this.orderService.getOrderAsAdmin(this.orderId).subscribe({
        next: (res) => {
          this.order = res;
          this.loadOrderHistory();
          this.loading = false;
        },
        error: () => {
          this.loading = false;
          this.messageService.add({
            severity: 'error',
            summary: 'Erro',
            detail: 'Erro ao carregar o conteúdo.',
            life: 3000,
          });
        },
      });
    });
  }

  loadOrderHistory() {
    this.actualOrderStatus = this.order.history.slice(-1).pop()?.status || '';
    this.nextOrderStatus =
      this.regularFlow[this.regularFlow.indexOf(this.actualOrderStatus) + 1];

    this.activeHistoryOrder = this.order.history.length - 1;

    const history: MenuItem[] = this.order.history.map((o) => {
      return { label: ORDER_STATUS_TEXT[o.status] };
    });

    const futureHistory: MenuItem[] = this.loadFutureOrderHistory(
      this.order.history[this.activeHistoryOrder].status
    ).map((fo) => {
      return { label: ORDER_STATUS_TEXT[fo] };
    });

    this.orderHistory = history.concat(futureHistory);
  }

  loadFutureOrderHistory(lastItem: string) {
    const reversedRegularFlow = this.regularFlow.slice().reverse();
    const futureFlowIndex = reversedRegularFlow.findIndex((status) => {
      return status === lastItem;
    });

    if (futureFlowIndex != -1) {
      return reversedRegularFlow.splice(0, futureFlowIndex).reverse();
    }

    return [];
  }

  changeOrderStatus() {
    this.loading = true;
    this.orderService
      .updateOrderStatus(this.orderId, this.nextOrderStatus)
      .subscribe({
        next: () => {
          this.loadData();
        },
        error: () => {
          this.loading = false;
          this.messageService.add({
            severity: 'error',
            summary: 'Erro',
            detail: 'Erro ao atualizar status do pedido.',
            life: 3000,
          });
        },
      });
  }
}
