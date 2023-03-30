import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MenuItem } from 'primeng/api';
import {
  PURCHASE_FINISHED,
  PURCHASE_FLOW_PAYMENT_DATA,
  PURCHASE_FLOW_PERSONAL_DATA,
} from 'src/app/core/global';
import {
  ACTUAL_STEP_PURCHASE_FLOW,
  SELECTED_SKU_CODE,
} from 'src/app/core/global';
import Sku from 'src/app/core/models/sku.model';

@Component({
  selector: 'app-product-purchase-flow',
  templateUrl: './product-purchase-flow.component.html',
  styleUrls: ['./product-purchase-flow.component.scss'],
})
export class ProductPurchaseFlowComponent implements OnInit, OnDestroy {
  step: number;
  selectedSku: Sku;
  items!: MenuItem[];
  purchaseSuccess!: boolean;

  constructor(private router: Router) {
    this.step = Number(sessionStorage.getItem(ACTUAL_STEP_PURCHASE_FLOW)) || 0;
    this.selectedSku = JSON.parse(
      sessionStorage.getItem(SELECTED_SKU_CODE) || '{}'
    );

    this.purchaseSuccess =
      sessionStorage.getItem(PURCHASE_FINISHED)?.toLowerCase() === 'true';

    if (!this.selectedSku) router.navigate(['/']);
  }

  ngOnInit() {
    this.items = [
      { label: 'Dados do usuário' },
      { label: 'Dados de pagamento' },
      { label: 'Resumo do pedido' },
    ];
  }

  ngOnDestroy() {
    sessionStorage.setItem(ACTUAL_STEP_PURCHASE_FLOW, '');
    sessionStorage.setItem(SELECTED_SKU_CODE, '');
    sessionStorage.setItem(PURCHASE_FLOW_PERSONAL_DATA, '');
    sessionStorage.setItem(PURCHASE_FLOW_PAYMENT_DATA, '');
    sessionStorage.setItem(PURCHASE_FINISHED, 'false');
  }

  nextStep() {
    this.step += 1;
    sessionStorage.setItem(ACTUAL_STEP_PURCHASE_FLOW, `${this.step}`);
  }

  backStep() {
    this.step -= 1;
    sessionStorage.setItem(ACTUAL_STEP_PURCHASE_FLOW, `${this.step}`);
  }

  setStep(step: number) {
    this.step = step;
    sessionStorage.setItem(ACTUAL_STEP_PURCHASE_FLOW, `${this.step}`);
  }

  resetStep() {
    this.setStep(0);
  }

  setPurchaseSuccess(value: boolean) {
    this.purchaseSuccess = value;
    sessionStorage.setItem(PURCHASE_FINISHED, `${value}`);
  }
}
