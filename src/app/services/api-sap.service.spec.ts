import { TestBed } from '@angular/core/testing';

import { ApiSapService } from './api-sap.service';

describe('ApiSapService', () => {
  let service: ApiSapService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ApiSapService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
