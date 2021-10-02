import { TestBed } from '@angular/core/testing';

import { SuiteCrmService } from './suite-crm.service';

describe('SuiteCrmService', () => {
  let service: SuiteCrmService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SuiteCrmService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
