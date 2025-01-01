import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PreviewLecturesComponent } from './preview-lectures.component';

describe('PreviewLecturesComponent', () => {
  let component: PreviewLecturesComponent;
  let fixture: ComponentFixture<PreviewLecturesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PreviewLecturesComponent]
    });
    fixture = TestBed.createComponent(PreviewLecturesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
