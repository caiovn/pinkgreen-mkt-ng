import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderAdministrationComponent } from './order-administration.component';

describe('OrderAdministrationComponent', () => {
  let component: OrderAdministrationComponent;
  let fixture: ComponentFixture<OrderAdministrationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OrderAdministrationComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OrderAdministrationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
