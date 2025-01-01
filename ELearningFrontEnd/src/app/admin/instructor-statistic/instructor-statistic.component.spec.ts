import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InstructorStatisticComponent } from './instructor-statistic.component';

describe('InstructorStatisticComponent', () => {
  let component: InstructorStatisticComponent;
  let fixture: ComponentFixture<InstructorStatisticComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [InstructorStatisticComponent]
    });
    fixture = TestBed.createComponent(InstructorStatisticComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
