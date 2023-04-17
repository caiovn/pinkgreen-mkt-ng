import { Component, OnInit } from '@angular/core';
import { ShoppingCartService } from '../../services/shopping-cart.service';
import Sku from '../../models/sku.model';

@Component({
  selector: 'app-shopping-cart',
  templateUrl: './shopping-cart.component.html',
  styleUrls: ['./shopping-cart.component.scss'],
})
export class ShoppingCartComponent implements OnInit {
  cartList!: Sku[];

  constructor(private shoppingCartService: ShoppingCartService) {}

  ngOnInit(): void {
    this.cartList = this.shoppingCartService.getCartItems();
  }
}
