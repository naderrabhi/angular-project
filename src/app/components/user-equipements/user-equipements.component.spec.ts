import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserEquipementsComponent } from './user-equipements.component';

describe('UserEquipementsComponent', () => {
  let component: UserEquipementsComponent;
  let fixture: ComponentFixture<UserEquipementsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserEquipementsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(UserEquipementsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
