import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VerticalBarOrderComponent } from './vertical-bar-order.component';

describe('VerticalBarOrderComponent', () => {
  let component: VerticalBarOrderComponent;
  let fixture: ComponentFixture<VerticalBarOrderComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [VerticalBarOrderComponent]
    });
    fixture = TestBed.createComponent(VerticalBarOrderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
