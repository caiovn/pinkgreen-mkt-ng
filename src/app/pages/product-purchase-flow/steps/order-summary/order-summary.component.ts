import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-order-summary',
  templateUrl: './order-summary.component.html',
  styleUrls: ['./order-summary.component.scss'],
})
export class OrderSummaryComponent {
  @Output() nextStepEvent = new EventEmitter();
  @Output() backStepEvent = new EventEmitter();

  clickNextButton() {
    this.nextStepEvent.emit();
  }
}
