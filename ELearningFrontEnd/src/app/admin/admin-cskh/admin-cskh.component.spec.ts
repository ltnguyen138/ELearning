import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminCskhComponent } from './admin-cskh.component';

describe('AdminCskhComponent', () => {
  let component: AdminCskhComponent;
  let fixture: ComponentFixture<AdminCskhComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AdminCskhComponent]
    });
    fixture = TestBed.createComponent(AdminCskhComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
