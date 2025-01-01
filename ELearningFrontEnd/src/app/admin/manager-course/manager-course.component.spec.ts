import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManagerCourseComponent } from './manager-course.component';

describe('ManagerCourseComponent', () => {
  let component: ManagerCourseComponent;
  let fixture: ComponentFixture<ManagerCourseComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ManagerCourseComponent]
    });
    fixture = TestBed.createComponent(ManagerCourseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
