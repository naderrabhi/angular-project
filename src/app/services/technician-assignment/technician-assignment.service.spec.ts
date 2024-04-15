import { TestBed } from '@angular/core/testing';

import { TechnicianAssignmentService } from './technician-assignment.service';

describe('TechnicianAssignmentService', () => {
  let service: TechnicianAssignmentService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TechnicianAssignmentService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
