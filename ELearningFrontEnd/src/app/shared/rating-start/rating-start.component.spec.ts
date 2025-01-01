import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RatingStartComponent } from './rating-start.component';

describe('RatingStartComponent', () => {
  let component: RatingStartComponent;
  let fixture: ComponentFixture<RatingStartComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RatingStartComponent]
    });
    fixture = TestBed.createComponent(RatingStartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
