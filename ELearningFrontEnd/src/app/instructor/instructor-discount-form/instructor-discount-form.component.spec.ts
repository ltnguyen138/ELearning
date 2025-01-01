import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InstructorDiscountFormComponent } from './instructor-discount-form.component';

describe('InstructorDiscountFormComponent', () => {
  let component: InstructorDiscountFormComponent;
  let fixture: ComponentFixture<InstructorDiscountFormComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [InstructorDiscountFormComponent]
    });
    fixture = TestBed.createComponent(InstructorDiscountFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
