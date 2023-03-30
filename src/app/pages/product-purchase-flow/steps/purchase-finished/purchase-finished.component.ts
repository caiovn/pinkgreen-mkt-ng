import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { SELECTED_SKU_CODE } from 'src/app/core/global';
import Sku from 'src/app/core/models/sku.model';

@Component({
  selector: 'app-purchase-finished',
  templateUrl: './purchase-finished.component.html',
  styleUrls: ['./purchase-finished.component.scss'],
})
export class PurchaseFinishedComponent {
  selectedSku: Sku;

  constructor(private router: Router) {
    this.selectedSku = JSON.parse(
      sessionStorage.getItem(SELECTED_SKU_CODE) || '{}'
    );
  }

  navigate(value: string) {
    this.router.navigate([value]);
  }
}
