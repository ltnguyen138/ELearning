import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InstructorCourseContentComponent } from './instructor-course-content.component';

describe('InstructorCourseContentComponent', () => {
  let component: InstructorCourseContentComponent;
  let fixture: ComponentFixture<InstructorCourseContentComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [InstructorCourseContentComponent]
    });
    fixture = TestBed.createComponent(InstructorCourseContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
