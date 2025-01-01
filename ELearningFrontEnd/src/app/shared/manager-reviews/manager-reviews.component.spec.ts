import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManagerReviewsComponent } from './manager-reviews.component';

describe('ManagerReviewsComponent', () => {
  let component: ManagerReviewsComponent;
  let fixture: ComponentFixture<ManagerReviewsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ManagerReviewsComponent]
    });
    fixture = TestBed.createComponent(ManagerReviewsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
