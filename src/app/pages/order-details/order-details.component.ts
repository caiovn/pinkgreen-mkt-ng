import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { KeycloakService } from 'keycloak-angular';
import { KeycloakProfile } from 'keycloak-js';
import { MenuItem } from 'primeng/api';
import Order, { ORDER_STATUS_TEXT } from 'src/app/core/models/order.model';
import { PaymentMethods } from 'src/app/core/models/product.model';
import { OrderService } from 'src/app/core/services/order.service';
import { RatingService } from 'src/app/core/services/rating.service';

@Component({
  selector: 'app-order-details',
  templateUrl: './order-details.component.html',
  styleUrls: ['./order-details.component.scss'],
})
export class OrderDetailsComponent implements OnInit {
  form!: FormGroup;

  orderId!: string;
  order!: Order;

  customerData!: KeycloakProfile;

  orderHistory: MenuItem[] = [];
  lastOrderHistoryItemIndex!: number;
  activeHistoryOrder!: number;

  ratingStarNumber = 0;
  RATING_TEXT: Record<number, string> = {
    1: 'Péssimo',
    2: 'Ruim',
    3: 'Neutro',
    4: 'Bom',
    5: 'Excelente',
  };

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
    private ratingService: RatingService,
    private keycloak: KeycloakService,
    private formBuilder: FormBuilder
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.orderId = params['id'];
    });
    this.loadData();
    this.createForm();
  }

  loadData() {
    this.keycloak.loadUserProfile().then((res) => {
      this.customerData = res;
      this.orderService.getOrder(this.orderId).subscribe((res) => {
        this.order = res;
        this.loadOrderHistory();
      });
    });
  }

  createForm() {
    this.form = this.formBuilder.group({
      stars: [0, Validators.required],
      comment: [''],
    });
  }

  submitRatingForm() {
    this.ratingService
      .createProductRating(
        this.orderId,
        this.order.productList[0].skuCode,
        this.form.get('stars')?.value,
        this.RATING_TEXT[this.form.get('stars')?.value],
        this.form.get('comment')?.value
      )
      .subscribe({
        next: () => {
          console.log('mandou');
        },
      });
  }

  loadOrderHistory() {
    this.activeHistoryOrder = this.order.history.length - 1;

    const history = this.order.history.map((o) => {
      return { label: ORDER_STATUS_TEXT[o.status] };
    });

    const futureHistory = this.loadFutureOrderHistory(
      this.order.history[this.activeHistoryOrder].status
    ).map((fo) => {
      return { label: ORDER_STATUS_TEXT[fo] };
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
