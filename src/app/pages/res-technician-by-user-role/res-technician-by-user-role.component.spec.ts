import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResTechnicianByUserRoleComponent } from './res-technician-by-user-role.component';

describe('ResTechnicianByUserRoleComponent', () => {
  let component: ResTechnicianByUserRoleComponent;
  let fixture: ComponentFixture<ResTechnicianByUserRoleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ResTechnicianByUserRoleComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ResTechnicianByUserRoleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
