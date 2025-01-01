import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InstructorCourseDetailComponent } from './instructor-course-detail.component';

describe('InstructorCourseDetailComponent', () => {
  let component: InstructorCourseDetailComponent;
  let fixture: ComponentFixture<InstructorCourseDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [InstructorCourseDetailComponent]
    });
    fixture = TestBed.createComponent(InstructorCourseDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
