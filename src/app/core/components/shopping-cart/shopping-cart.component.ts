import { Component, OnInit } from '@angular/core';
import Sku from '../../models/sku.model';
import { ShoppingCartService } from '../../services/shopping-cart.service';

@Component({
  selector: 'app-shopping-cart',
  templateUrl: './shopping-cart.component.html',
  styleUrls: ['./shopping-cart.component.scss'],
})
export class ShoppingCartComponent implements OnInit {
  totalPrice = 0;
  cartList!: Sku[];

  constructor(private shoppingCartService: ShoppingCartService) {}

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
    this.ngOnInit();
  }

  getTotalPrice() {
    this.totalPrice = 0;
    return this.cartList.map(
      (_item) =>
        (this.totalPrice += _item.price.listPrice * (_item.quantity || 0))
    );
  }
}
