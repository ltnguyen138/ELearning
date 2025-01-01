import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LearnCourseContentComponent } from './learn-course-content.component';

describe('LearnCourseContentComponent', () => {
  let component: LearnCourseContentComponent;
  let fixture: ComponentFixture<LearnCourseContentComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LearnCourseContentComponent]
    });
    fixture = TestBed.createComponent(LearnCourseContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
