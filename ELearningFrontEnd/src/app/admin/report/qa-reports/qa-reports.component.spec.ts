import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QaReportsComponent } from './qa-reports.component';

describe('QaReportsComponent', () => {
  let component: QaReportsComponent;
  let fixture: ComponentFixture<QaReportsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [QaReportsComponent]
    });
    fixture = TestBed.createComponent(QaReportsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
