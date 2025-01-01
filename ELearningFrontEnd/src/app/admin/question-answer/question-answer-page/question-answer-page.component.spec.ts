import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuestionAnswerPageComponent } from './question-answer-page.component';

describe('QuestionAnswerPageComponent', () => {
  let component: QuestionAnswerPageComponent;
  let fixture: ComponentFixture<QuestionAnswerPageComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [QuestionAnswerPageComponent]
    });
    fixture = TestBed.createComponent(QuestionAnswerPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
