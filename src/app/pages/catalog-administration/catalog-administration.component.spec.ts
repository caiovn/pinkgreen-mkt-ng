import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CatalogAdministrationComponent } from './catalog-administration.component';

describe('CatalogAdministrationComponent', () => {
  let component: CatalogAdministrationComponent;
  let fixture: ComponentFixture<CatalogAdministrationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CatalogAdministrationComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CatalogAdministrationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
