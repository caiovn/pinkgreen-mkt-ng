import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import Order, { ORDER_STATUS_TEXT } from 'src/app/core/models/order.model';
import { OrderService } from 'src/app/core/services/order.service';

@Component({
  selector: 'app-order-administration',
  templateUrl: './order-administration.component.html',
  styleUrls: ['./order-administration.component.scss'],
})
export class OrderAdministrationComponent implements OnInit {
  orders!: Order[]

  constructor(private orderService: OrderService, private router: Router) {}

  ORDER_STATUS_TEXT =  ORDER_STATUS_TEXT

  ngOnInit(): void {
    this.orderService.getOrdersReadyToShip().subscribe({
      next: (res) => {
        this.orders = res
      },
      error: () => {
        this.router.navigate(['/'])
      }
    });
  }

  selectOrder(order: Order) {
    this.router.navigate(['/order-administration/', order.id])
  }
}
