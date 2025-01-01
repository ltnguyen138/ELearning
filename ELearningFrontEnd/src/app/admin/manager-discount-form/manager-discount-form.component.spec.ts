import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManagerDiscountFormComponent } from './manager-discount-form.component';

describe('ManagerDiscountFormComponent', () => {
  let component: ManagerDiscountFormComponent;
  let fixture: ComponentFixture<ManagerDiscountFormComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ManagerDiscountFormComponent]
    });
    fixture = TestBed.createComponent(ManagerDiscountFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
