import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LearnerChaptersComponent } from './learner-chapters.component';

describe('LearnerChaptersComponent', () => {
  let component: LearnerChaptersComponent;
  let fixture: ComponentFixture<LearnerChaptersComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LearnerChaptersComponent]
    });
    fixture = TestBed.createComponent(LearnerChaptersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
