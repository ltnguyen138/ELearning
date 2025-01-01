import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManagerCourseContentComponent } from './manager-course-content.component';

describe('ManagerCourseContentComponent', () => {
  let component: ManagerCourseContentComponent;
  let fixture: ComponentFixture<ManagerCourseContentComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ManagerCourseContentComponent]
    });
    fixture = TestBed.createComponent(ManagerCourseContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
