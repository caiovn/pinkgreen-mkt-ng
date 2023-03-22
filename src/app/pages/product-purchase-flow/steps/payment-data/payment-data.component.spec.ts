import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentDataComponent } from './payment-data.component';

describe('PaymentDataComponent', () => {
  let component: PaymentDataComponent;
  let fixture: ComponentFixture<PaymentDataComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PaymentDataComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PaymentDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
