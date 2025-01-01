import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LearnerStatisticsComponent } from './learner-statistics.component';

describe('LearnerStatisticsComponent', () => {
  let component: LearnerStatisticsComponent;
  let fixture: ComponentFixture<LearnerStatisticsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LearnerStatisticsComponent]
    });
    fixture = TestBed.createComponent(LearnerStatisticsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
