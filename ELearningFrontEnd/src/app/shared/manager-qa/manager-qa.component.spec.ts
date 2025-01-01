import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManagerQaComponent } from './manager-qa.component';

describe('ManagerQaComponent', () => {
  let component: ManagerQaComponent;
  let fixture: ComponentFixture<ManagerQaComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ManagerQaComponent]
    });
    fixture = TestBed.createComponent(ManagerQaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
