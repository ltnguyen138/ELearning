import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InstructorDiscountComponent } from './instructor-discount.component';

describe('InstructorDiscountComponent', () => {
  let component: InstructorDiscountComponent;
  let fixture: ComponentFixture<InstructorDiscountComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [InstructorDiscountComponent]
    });
    fixture = TestBed.createComponent(InstructorDiscountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
