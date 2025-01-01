import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InstructorPreviewLecturesComponent } from './instructor-preview-lectures.component';

describe('InstructorPreviewLecturesComponent', () => {
  let component: InstructorPreviewLecturesComponent;
  let fixture: ComponentFixture<InstructorPreviewLecturesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [InstructorPreviewLecturesComponent]
    });
    fixture = TestBed.createComponent(InstructorPreviewLecturesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
