import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SharedAnswersComponent } from './shared-answers.component';

describe('SharedAnswersComponent', () => {
  let component: SharedAnswersComponent;
  let fixture: ComponentFixture<SharedAnswersComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SharedAnswersComponent]
    });
    fixture = TestBed.createComponent(SharedAnswersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
