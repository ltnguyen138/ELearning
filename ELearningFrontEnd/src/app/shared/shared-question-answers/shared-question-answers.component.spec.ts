import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SharedQuestionAnswersComponent } from './shared-question-answers.component';

describe('SharedQuestionAnswersComponent', () => {
  let component: SharedQuestionAnswersComponent;
  let fixture: ComponentFixture<SharedQuestionAnswersComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SharedQuestionAnswersComponent]
    });
    fixture = TestBed.createComponent(SharedQuestionAnswersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
