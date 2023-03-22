import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductPurchaseFlowComponent } from './product-purchase-flow.component';

describe('ProductPurchaseFlowComponent', () => {
  let component: ProductPurchaseFlowComponent;
  let fixture: ComponentFixture<ProductPurchaseFlowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProductPurchaseFlowComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductPurchaseFlowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
