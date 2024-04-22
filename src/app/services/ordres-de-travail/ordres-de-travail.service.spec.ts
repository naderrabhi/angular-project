import { TestBed } from '@angular/core/testing';

import { OrdresDeTravailService } from './ordres-de-travail.service';

describe('OrdresDeTravailService', () => {
  let service: OrdresDeTravailService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OrdresDeTravailService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
