import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GridStatisticTypeCourseComponent } from './grid-statistic-type-course.component';

describe('GridStatisticTypeCourseComponent', () => {
  let component: GridStatisticTypeCourseComponent;
  let fixture: ComponentFixture<GridStatisticTypeCourseComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [GridStatisticTypeCourseComponent]
    });
    fixture = TestBed.createComponent(GridStatisticTypeCourseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
