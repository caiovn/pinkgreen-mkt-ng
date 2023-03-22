import { Component, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'app-product-purchase-flow',
  templateUrl: './product-purchase-flow.component.html',
  styleUrls: ['./product-purchase-flow.component.scss'],
})
export class ProductPurchaseFlowComponent implements OnInit {
  step = 0;
  items!: MenuItem[];

  ngOnInit() {
    this.items = [
      { label: 'Dados do usuário' },
      { label: 'Dados de pagamento' },
      { label: 'Resumo do pedido' },
    ];
  }

  nextStep() {
    console.log(this.step);
    this.step += 1;
  }

  backStep() {
    this.step -= 1;
  }

  setStep(step: number) {
    this.step = step;
  }

  resetStep() {
    this.setStep(0);
  }
}
