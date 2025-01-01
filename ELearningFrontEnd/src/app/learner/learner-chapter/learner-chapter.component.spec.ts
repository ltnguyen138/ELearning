import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LearnerChapterComponent } from './learner-chapter.component';

describe('LearnerChapterComponent', () => {
  let component: LearnerChapterComponent;
  let fixture: ComponentFixture<LearnerChapterComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LearnerChapterComponent]
    });
    fixture = TestBed.createComponent(LearnerChapterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
