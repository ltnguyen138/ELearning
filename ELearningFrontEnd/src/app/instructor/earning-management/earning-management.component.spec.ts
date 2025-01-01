import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EarningManagementComponent } from './earning-management.component';

describe('EarningManagementComponent', () => {
  let component: EarningManagementComponent;
  let fixture: ComponentFixture<EarningManagementComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EarningManagementComponent]
    });
    fixture = TestBed.createComponent(EarningManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
