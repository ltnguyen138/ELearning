import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManagerReviewComponent } from './manager-review.component';

describe('ManagerReviewComponent', () => {
  let component: ManagerReviewComponent;
  let fixture: ComponentFixture<ManagerReviewComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ManagerReviewComponent]
    });
    fixture = TestBed.createComponent(ManagerReviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
