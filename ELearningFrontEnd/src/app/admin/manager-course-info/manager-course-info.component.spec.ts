import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManagerCourseInfoComponent } from './manager-course-info.component';

describe('ManagerCourseInfoComponent', () => {
  let component: ManagerCourseInfoComponent;
  let fixture: ComponentFixture<ManagerCourseInfoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ManagerCourseInfoComponent]
    });
    fixture = TestBed.createComponent(ManagerCourseInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
