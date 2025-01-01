import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReviewReportsComponent } from './review-reports.component';

describe('ReviewReportsComponent', () => {
  let component: ReviewReportsComponent;
  let fixture: ComponentFixture<ReviewReportsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ReviewReportsComponent]
    });
    fixture = TestBed.createComponent(ReviewReportsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
