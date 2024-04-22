import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmplacementsComponent } from './emplacements.component';

describe('EmplacementsComponent', () => {
  let component: EmplacementsComponent;
  let fixture: ComponentFixture<EmplacementsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmplacementsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EmplacementsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
