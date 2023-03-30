import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { KeycloakService } from 'keycloak-angular';
import { MessageService } from 'primeng/api';
import {
  PURCHASE_FLOW_PAYMENT_DATA,
  PURCHASE_FLOW_PERSONAL_DATA,
  SELECTED_SKU_CODE,
} from 'src/app/core/global';
import Sku from 'src/app/core/models/sku.model';
import { Address } from 'src/app/core/models/user.model';
import { OrderService } from 'src/app/core/services/order.service';

@Component({
  selector: 'app-order-summary',
  templateUrl: './order-summary.component.html',
  styleUrls: ['./order-summary.component.scss'],
})
export class OrderSummaryComponent implements OnInit {
  @Output() nextStepEvent = new EventEmitter();
  @Output() backStepEvent = new EventEmitter();
  @Output() setPurchaseSuccessEvent = new EventEmitter<boolean>();

  skuData!: Sku;
  addressData!: Address;
  paymentData!: any;

  userName!: string;
  customer: any;

  paymentMethods: Record<string, string> = {
    CREDIT_CARD: 'Cartão de crédito',
    DEBIT_CARD: 'Cartão de débito',
    BANK_SLIP: 'Boleto',
  };

  constructor(
    private keycloak: KeycloakService,
    private orderService: OrderService,
    private messageService: MessageService,

  ) {}

  ngOnInit() {
    this.keycloak.loadUserProfile().then((res: any) => {
      this.customer = res;
      this.userName = `${res.firstName} ${res.lastName}`;
      this.addressData = JSON.parse(
        sessionStorage.getItem(PURCHASE_FLOW_PERSONAL_DATA) || '{}'
      );
      this.skuData = JSON.parse(
        sessionStorage.getItem(SELECTED_SKU_CODE) || '{}'
      );
      this.paymentData = JSON.parse(
        sessionStorage.getItem(PURCHASE_FLOW_PAYMENT_DATA) || '{}'
      );
    });
  }

  clickNextButton() {
    const orderPayload = {
      customerId: this.customer.id || '',
      shippingData: {
        freightPrice: 0,
        deliveryDays: 12,
        address: {
          ...this.addressData,
          zipcode: this.transformStrToCep(this.addressData.zipcode),
          phone: this.customer.attributes.phone[0],
        },
      },
      productList: [
        {
          price: this.skuData.price,
          skuCode: this.skuData.skuCode,
          quantity: 1,
        },
      ],
      paymentData: {
        paymentMethod: this.paymentData.paymentMethod,
        paymentMethodProperties: {
          cardNumber: this.paymentData.numberCard,
          cvv: this.paymentData.cvv,
          validationDate: this.paymentData.validateData,
          document: this.paymentData.differentTitular
            ? this.paymentData.differentCpf
            : this.customer.attributes.CPF[0],
          ownerName: this.paymentData.cardHolder,
          birthday: '21/05/2000',
          phone: this.customer.attributes.phone[0],
          email: this.customer.email,
        },
        paymentAddress: this.paymentData.differentAddress
          ? {
              country: 'Brasil',
              state: this.paymentData.state,
              city: this.paymentData.city,
              neighborhood: this.paymentData.neighborhood,
              street: this.paymentData.street,
              number: this.paymentData.number,
              zipcode: this.transformStrToCep(this.paymentData.zipcode),
              complement: this.paymentData.complement,
              phone: this.customer.attributes.phone[0],
            }
          : {
              ...this.addressData,
              zipcode: this.transformStrToCep(this.addressData.zipcode),
              phone: this.customer.attributes.phone[0],
            },
      },
    };
    this.orderService.createOrder(orderPayload).subscribe({
      next: () => {
        this.setPurchaseSuccessEvent.emit(true);
      },
      error: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Erro',
          detail: 'Erro ao efetuar o pedido.',
          life: 3000,
        });
      }
    });
    console.log(orderPayload);
  }

  clickBackButton() {
    this.backStepEvent.emit();
  }

  transformStrToCep(val: string) {
    return val
      .replace(/\D/g, '')
      .replace(/(\d{5})(\d)/, '$1-$2')
      .replace(/(-\d{3})\d+?$/, '$1');
  }
}
