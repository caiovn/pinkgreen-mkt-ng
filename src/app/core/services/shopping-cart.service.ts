import { Injectable } from '@angular/core';
import { SHOPPING_CART } from '../global';
import Sku from '../models/sku.model';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class ShoppingCartService {
  constructor() {
    const cart = sessionStorage.getItem(SHOPPING_CART);

    if (!cart) {
      sessionStorage.setItem(SHOPPING_CART, '[]');
    }
  }

  getCartItems() {
    return JSON.parse(sessionStorage.getItem(SHOPPING_CART) || '[]');
  }

  addItemToCart(item: Sku) {
    const cartItems: Sku[] = JSON.parse(
      sessionStorage.getItem(SHOPPING_CART) || '[]'
    );

    if (cartItems.find((_item) => _item.skuCode === item.skuCode)) {
      cartItems.map((listItem) => {
        if (listItem.skuCode === item.skuCode) {
          listItem.product.quantity = (listItem.product.quantity || 0) + 1;
        }
      });
    } else {
      cartItems.push({ ...item, product: { ...item.product, quantity: 1 } });
    }

    sessionStorage.setItem(SHOPPING_CART, JSON.stringify(cartItems));
  }
}
