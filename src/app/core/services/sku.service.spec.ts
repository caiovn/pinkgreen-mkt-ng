import { TestBed } from '@angular/core/testing';

import { SkuService } from './sku.service';

describe('SkuService', () => {
  let service: SkuService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SkuService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
