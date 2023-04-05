import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateEditBrandComponent } from './create-edit-brand.component';

describe('CreateEditBrandComponent', () => {
  let component: CreateEditBrandComponent;
  let fixture: ComponentFixture<CreateEditBrandComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateEditBrandComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateEditBrandComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
