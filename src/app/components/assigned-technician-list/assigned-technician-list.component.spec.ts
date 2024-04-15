import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssignedTechnicianListComponent } from './assigned-technician-list.component';

describe('AssignedTechnicianListComponent', () => {
  let component: AssignedTechnicianListComponent;
  let fixture: ComponentFixture<AssignedTechnicianListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AssignedTechnicianListComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AssignedTechnicianListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
