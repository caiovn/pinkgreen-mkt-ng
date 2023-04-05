import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateEditProductComponent } from './create-edit-product.component';

describe('CreateEditProductComponent', () => {
  let component: CreateEditProductComponent;
  let fixture: ComponentFixture<CreateEditProductComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateEditProductComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateEditProductComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
