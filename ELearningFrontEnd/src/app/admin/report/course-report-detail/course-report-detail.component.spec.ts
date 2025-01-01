import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CourseReportDetailComponent } from './course-report-detail.component';

describe('CourseReportDetailComponent', () => {
  let component: CourseReportDetailComponent;
  let fixture: ComponentFixture<CourseReportDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CourseReportDetailComponent]
    });
    fixture = TestBed.createComponent(CourseReportDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
