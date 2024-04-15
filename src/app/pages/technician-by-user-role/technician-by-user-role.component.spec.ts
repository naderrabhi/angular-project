import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TechnicianByUserRoleComponent } from './technician-by-user-role.component';

describe('TechnicianByUserRoleComponent', () => {
  let component: TechnicianByUserRoleComponent;
  let fixture: ComponentFixture<TechnicianByUserRoleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TechnicianByUserRoleComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TechnicianByUserRoleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
