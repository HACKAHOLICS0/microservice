import { TestBed } from '@angular/core/testing';

import { SupplierProductsService } from './supplier-products.service';

describe('SupplierProductsService', () => {
  let service: SupplierProductsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SupplierProductsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
