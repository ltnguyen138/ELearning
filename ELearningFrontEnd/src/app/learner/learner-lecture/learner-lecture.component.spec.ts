import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LearnerLectureComponent } from './learner-lecture.component';

describe('LearnerLectureComponent', () => {
  let component: LearnerLectureComponent;
  let fixture: ComponentFixture<LearnerLectureComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LearnerLectureComponent]
    });
    fixture = TestBed.createComponent(LearnerLectureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
