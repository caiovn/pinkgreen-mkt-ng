import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderAdministrationDetailsComponent } from './order-administration-details.component';

describe('OrderAdministrationDetailsComponent', () => {
  let component: OrderAdministrationDetailsComponent;
  let fixture: ComponentFixture<OrderAdministrationDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OrderAdministrationDetailsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OrderAdministrationDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
