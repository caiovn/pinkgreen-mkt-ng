import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import Order, {
  ORDER_STATUS_TEXT,
  OrderProductList,
} from 'src/app/core/models/order.model';
import { OrderService } from 'src/app/core/services/order.service';

@Component({
  selector: 'app-order-administration',
  templateUrl: './order-administration.component.html',
  styleUrls: ['./order-administration.component.scss'],
})
export class OrderAdministrationComponent implements OnInit {
  orders!: Order[];

  constructor(private orderService: OrderService, private router: Router) {}

  ORDER_STATUS_TEXT = ORDER_STATUS_TEXT;

  ngOnInit(): void {
    this.orderService.getAllOrdersAsAdmin().subscribe({
      next: (res) => {
        this.orders = res;
      },
      error: () => {
        this.router.navigate(['/']);
      },
    });
  }

  getOrderProductsName(orderProducts: OrderProductList[]) {
    let productName;

    productName = orderProducts.map((product) => product.name).join(' + ');
    return productName;
  }

  getOrderPrice(orderProducts: OrderProductList[]) {
    let totalPrice = 0;
    orderProducts.map(
      (product) => (totalPrice += product.price * (product?.quantity || 1))
    );

    return totalPrice;
  }

  selectOrder(order: Order) {
    this.router.navigate(['/order-administration/', order.id]);
  }
}
