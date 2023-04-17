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

    cartItems.push(item);

    sessionStorage.setItem(SHOPPING_CART, JSON.stringify(cartItems));
  }
}
