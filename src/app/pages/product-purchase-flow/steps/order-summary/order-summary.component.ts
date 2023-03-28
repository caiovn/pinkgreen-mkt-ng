import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { KeycloakService } from 'keycloak-angular';
import { PURCHASE_FLOW_PERSONAL_DATA, SELECTED_SKU_CODE } from 'src/app/core/global';
import Sku from 'src/app/core/models/sku.model';
import { Address } from 'src/app/core/models/user.model';

@Component({
  selector: 'app-order-summary',
  templateUrl: './order-summary.component.html',
  styleUrls: ['./order-summary.component.scss'],
})
export class OrderSummaryComponent implements OnInit {
  addressData!: Address;
  skuData!: Sku;
  userName!: string;
  @Output() nextStepEvent = new EventEmitter();
  @Output() backStepEvent = new EventEmitter();

  constructor(private keycloak: KeycloakService) {}

  ngOnInit() {
    this.keycloak.loadUserProfile().then((res) => {
      this.userName = `${res.firstName} ${res.lastName}`
      this.addressData = JSON.parse(
        sessionStorage.getItem(PURCHASE_FLOW_PERSONAL_DATA) || '{}'
      );
      this.skuData = JSON.parse(
        sessionStorage.getItem(SELECTED_SKU_CODE) || '{}'
      );
    })
  }

  clickNextButton() {
    console.log('booooooooooooooooooooooooooooooooooooooooooom');
  }

  clickBackButton() {
    this.backStepEvent.emit();
  }
}
