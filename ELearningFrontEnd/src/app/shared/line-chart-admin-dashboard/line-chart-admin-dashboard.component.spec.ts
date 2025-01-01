import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LineChartAdminDashboardComponent } from './line-chart-admin-dashboard.component';

describe('LineChartAdminDashboardComponent', () => {
  let component: LineChartAdminDashboardComponent;
  let fixture: ComponentFixture<LineChartAdminDashboardComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LineChartAdminDashboardComponent]
    });
    fixture = TestBed.createComponent(LineChartAdminDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
