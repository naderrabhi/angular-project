import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrdreDeTravailComponent } from './ordre-de-travail.component';

describe('OrdreDeTravailComponent', () => {
  let component: OrdreDeTravailComponent;
  let fixture: ComponentFixture<OrdreDeTravailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OrdreDeTravailComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(OrdreDeTravailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
