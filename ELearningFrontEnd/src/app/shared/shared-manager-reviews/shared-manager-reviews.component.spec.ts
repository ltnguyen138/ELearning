import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SharedManagerReviewsComponent } from './shared-manager-reviews.component';

describe('SharedManagerReviewsComponent', () => {
  let component: SharedManagerReviewsComponent;
  let fixture: ComponentFixture<SharedManagerReviewsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SharedManagerReviewsComponent]
    });
    fixture = TestBed.createComponent(SharedManagerReviewsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
