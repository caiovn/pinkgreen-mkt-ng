import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { KeycloakService } from 'keycloak-angular';
import { KeycloakProfile } from 'keycloak-js';
import { MenuItem, MessageService } from 'primeng/api';
import { catchError, concatMap, tap, throwError } from 'rxjs';
import Order, { ORDER_STATUS_TEXT } from 'src/app/core/models/order.model';
import { PaymentMethods } from 'src/app/core/models/product.model';
import { ProductDetailsRating } from 'src/app/core/models/rating.model';
import { OrderService } from 'src/app/core/services/order.service';
import { RatingService } from 'src/app/core/services/rating.service';

@Component({
  selector: 'app-order-details',
  templateUrl: './order-details.component.html',
  styleUrls: ['./order-details.component.scss'],
})
export class OrderDetailsComponent implements OnInit {
  form!: FormGroup;
  loading = true;

  orderId!: string;
  order!: Order;

  customerData!: KeycloakProfile;

  orderHistory: MenuItem[] = [];
  activeHistoryOrder!: number;

  ratingFormValue!: ProductDetailsRating;
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
    private formBuilder: FormBuilder,
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

      return this.orderService
        .getOrder(this.orderId)
        .pipe(
          tap((_order) => {
            this.order = _order;
          }),
          concatMap((_order) =>
            this.ratingService.getUserProductRating(
              _order.id,
              _order.productList[0].skuCode
            )
          ),
          tap((_rating) => (this.ratingFormValue = _rating)),
          catchError(() =>
            throwError(() => new Error('Erro ao carregar o conteúdo'))
          )
        )
        .subscribe({
          next: () => {
            this.createForm();
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

  createForm() {
    this.form = this.formBuilder.group({
      stars: [
        {
          value: this.ratingFormValue?.stars || 0,
          disabled: this.ratingFormValue?.ratingFilled,
        },
        Validators.required,
      ],
      comment: [
        {
          value: this.ratingFormValue?.evaluation || '',
          disabled: this.ratingFormValue?.ratingFilled,
        },
      ],
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
          this.ratingFormValue.ratingFilled = true;
        },
        error: () => {
          this.messageService.add({
            severity: 'error',
            summary: 'Erro',
            detail: 'Erro ao avaliar o pedido.',
            life: 3000,
          });
        },
      });
  }

  loadOrderHistory() {
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
}
