import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PeripheralByUserRoleComponent } from './peripheral-by-user-role.component';

describe('PeripheralByUserRoleComponent', () => {
  let component: PeripheralByUserRoleComponent;
  let fixture: ComponentFixture<PeripheralByUserRoleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PeripheralByUserRoleComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PeripheralByUserRoleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
