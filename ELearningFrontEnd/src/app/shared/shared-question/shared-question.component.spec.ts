import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SharedQuestionComponent } from './shared-question.component';

describe('SharedQuestionComponent', () => {
  let component: SharedQuestionComponent;
  let fixture: ComponentFixture<SharedQuestionComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SharedQuestionComponent]
    });
    fixture = TestBed.createComponent(SharedQuestionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
