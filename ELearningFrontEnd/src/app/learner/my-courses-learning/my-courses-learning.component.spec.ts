import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyCoursesLearningComponent } from './my-courses-learning.component';

describe('MyCoursesLearningComponent', () => {
  let component: MyCoursesLearningComponent;
  let fixture: ComponentFixture<MyCoursesLearningComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MyCoursesLearningComponent]
    });
    fixture = TestBed.createComponent(MyCoursesLearningComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
