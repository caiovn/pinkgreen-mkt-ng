import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-payment-data',
  templateUrl: './payment-data.component.html',
  styleUrls: ['./payment-data.component.scss'],
})
export class PaymentDataComponent {
  @Output() nextStepEvent = new EventEmitter();
  @Output() backStepEvent = new EventEmitter();

  clickNextButton() {
    this.nextStepEvent.emit();
  }

  clickBackButton() {
    this.backStepEvent.emit();
  }
}
