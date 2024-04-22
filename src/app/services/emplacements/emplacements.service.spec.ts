import { TestBed } from '@angular/core/testing';

import { EmplacementsService } from './emplacements.service';

describe('EmplacementsService', () => {
  let service: EmplacementsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EmplacementsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
