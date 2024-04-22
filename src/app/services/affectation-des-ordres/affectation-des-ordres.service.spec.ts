import { TestBed } from '@angular/core/testing';

import { AffectationDesOrdresService } from './affectation-des-ordres.service';

describe('AffectationDesOrdresService', () => {
  let service: AffectationDesOrdresService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AffectationDesOrdresService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
