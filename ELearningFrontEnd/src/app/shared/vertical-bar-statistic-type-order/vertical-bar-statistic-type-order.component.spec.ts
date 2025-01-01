import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VerticalBarStatisticTypeOrderComponent } from './vertical-bar-statistic-type-order.component';

describe('VerticalBarStatisticTypeOrderComponent', () => {
  let component: VerticalBarStatisticTypeOrderComponent;
  let fixture: ComponentFixture<VerticalBarStatisticTypeOrderComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [VerticalBarStatisticTypeOrderComponent]
    });
    fixture = TestBed.createComponent(VerticalBarStatisticTypeOrderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
