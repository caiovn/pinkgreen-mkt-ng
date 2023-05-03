import { Component, OnInit } from '@angular/core';
import Sku from '../../models/sku.model';
import { ShoppingCartService } from '../../services/shopping-cart.service';
import { MessageService } from 'primeng/api';
import { ACTUAL_STEP_PURCHASE_FLOW, PURCHASE_FINISHED, PURCHASE_FLOW_PAYMENT_DATA, PURCHASE_FLOW_PERSONAL_DATA, SELECTED_SKU_CODE } from '../../global';
import { Router } from '@angular/router';
import { DynamicDialogRef } from 'primeng/dynamicdialog';

@Component({
  selector: 'app-shopping-cart',
  templateUrl: './shopping-cart.component.html',
  styleUrls: ['./shopping-cart.component.scss'],
})
export class ShoppingCartComponent implements OnInit {
  totalPrice = 0;
  cartList!: Sku[];

  constructor(
    private shoppingCartService: ShoppingCartService,
    private messageService: MessageService,
    private ref: DynamicDialogRef,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.cartList = this.shoppingCartService.getCartItems();
    this.getTotalPrice();
  }

  modifyValue(event: any, item: Sku) {
    if (event.formattedValue > event.value) {
      this.shoppingCartService.decrementProductQuantity(item, event.value);
      this.ngOnInit();
      return;
    }

    this.shoppingCartService.incrementProductQuantity(item, event.value);
    this.ngOnInit();
  }

  removeProduct(skuCode: string) {
    this.shoppingCartService.deleteItemBySkuCode(skuCode);
    this.openInfoToast('Produto Removido!');
    this.ngOnInit();
  }

  getTotalPrice() {
    this.totalPrice = 0;
    return this.cartList.map(
      (_item) =>
        (this.totalPrice += _item.price.listPrice * (_item.quantity || 0))
    );
  }

  openInfoToast(msg: string) {
    this.messageService.add({
      severity: 'info',
      summary: 'Sucesso',
      detail: msg,
      life: 1500,
    });
  }

  clickBuyButton() {
    sessionStorage.setItem(SELECTED_SKU_CODE, JSON.stringify(this.cartList));
    sessionStorage.setItem(ACTUAL_STEP_PURCHASE_FLOW, '');
    sessionStorage.setItem(PURCHASE_FLOW_PERSONAL_DATA, '');
    sessionStorage.setItem(PURCHASE_FLOW_PAYMENT_DATA, '');
    sessionStorage.setItem(PURCHASE_FINISHED, 'false');
    
    this.ref.close();
    this.router.navigate(['/purchase']).then(() => {
      window.location.reload();
    });
  }
}
