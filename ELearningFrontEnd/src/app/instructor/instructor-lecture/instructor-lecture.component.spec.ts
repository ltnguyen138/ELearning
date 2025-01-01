import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InstructorLectureComponent } from './instructor-lecture.component';

describe('InstructorLectureComponent', () => {
  let component: InstructorLectureComponent;
  let fixture: ComponentFixture<InstructorLectureComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [InstructorLectureComponent]
    });
    fixture = TestBed.createComponent(InstructorLectureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
