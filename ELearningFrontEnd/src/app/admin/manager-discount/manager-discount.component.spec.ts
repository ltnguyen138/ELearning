import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManagerDiscountComponent } from './manager-discount.component';

describe('ManagerDiscountComponent', () => {
  let component: ManagerDiscountComponent;
  let fixture: ComponentFixture<ManagerDiscountComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ManagerDiscountComponent]
    });
    fixture = TestBed.createComponent(ManagerDiscountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
