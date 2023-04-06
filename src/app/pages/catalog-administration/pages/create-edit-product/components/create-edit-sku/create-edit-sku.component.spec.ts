import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateEditSkuComponent } from './create-edit-sku.component';

describe('CreateEditSkuComponent', () => {
  let component: CreateEditSkuComponent;
  let fixture: ComponentFixture<CreateEditSkuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateEditSkuComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateEditSkuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
