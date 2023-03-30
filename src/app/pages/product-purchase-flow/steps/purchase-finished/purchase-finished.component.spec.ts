import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PurchaseFinishedComponent } from './purchase-finished.component';

describe('PurchaseFinishedComponent', () => {
  let component: PurchaseFinishedComponent;
  let fixture: ComponentFixture<PurchaseFinishedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PurchaseFinishedComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PurchaseFinishedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
