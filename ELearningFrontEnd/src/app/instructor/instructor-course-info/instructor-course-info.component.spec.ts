import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InstructorCourseInfoComponent } from './instructor-course-info.component';

describe('InstructorCourseInfoComponent', () => {
  let component: InstructorCourseInfoComponent;
  let fixture: ComponentFixture<InstructorCourseInfoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [InstructorCourseInfoComponent]
    });
    fixture = TestBed.createComponent(InstructorCourseInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
