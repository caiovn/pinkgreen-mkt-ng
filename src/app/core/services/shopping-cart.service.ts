import { Injectable } from '@angular/core';
import { SHOPPING_CART } from '../global';
import Sku from '../models/sku.model';

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

  decrementProductQuantity(item: Sku, quantity: number) {
    const cartItems: Sku[] = JSON.parse(
      sessionStorage.getItem(SHOPPING_CART) || '[]'
    );

    if (cartItems.find((_item) => _item.skuCode === item.skuCode)) {
      cartItems.map((listItem) => {
        if (listItem.skuCode === item.skuCode) {
          listItem.quantity = quantity;
        }
      });
    }

    sessionStorage.setItem(SHOPPING_CART, JSON.stringify(cartItems));
  }

  incrementProductQuantity(item: Sku, quantity: number) {
    const cartItems: Sku[] = JSON.parse(
      sessionStorage.getItem(SHOPPING_CART) || '[]'
    );

    if (cartItems.find((_item) => _item.skuCode === item.skuCode)) {
      cartItems.map((listItem) => {
        if (listItem.skuCode === item.skuCode) {
          listItem.quantity = quantity;
        }
      });
    }

    sessionStorage.setItem(SHOPPING_CART, JSON.stringify(cartItems));
  }

  deleteItemBySkuCode(skuCode: string) {
    const cartItems: Sku[] = JSON.parse(
      sessionStorage.getItem(SHOPPING_CART) || '[]'
    );
    const index = cartItems.findIndex((_item) => _item.skuCode === skuCode);

    if (index > -1) cartItems.splice(index, 1);

    sessionStorage.setItem(SHOPPING_CART, JSON.stringify(cartItems));
  }

  addItemToCart(item: Sku) {
    const cartItems: Sku[] = JSON.parse(
      sessionStorage.getItem(SHOPPING_CART) || '[]'
    );

    if (cartItems.find((_item) => _item.skuCode === item.skuCode)) {
      cartItems.map((listItem) => {
        if (listItem.skuCode === item.skuCode) {
          listItem.quantity = (listItem.quantity || 0) + 1;
        }
      });
    } else {
      cartItems.push({ ...item, quantity: 1 });
    }

    sessionStorage.setItem(SHOPPING_CART, JSON.stringify(cartItems));
  }

  clearCart() {
    sessionStorage.setItem(SHOPPING_CART, '[]')
  }
}
