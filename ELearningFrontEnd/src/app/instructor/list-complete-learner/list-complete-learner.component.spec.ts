import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListCompleteLearnerComponent } from './list-complete-learner.component';

describe('ListCompleteLearnerComponent', () => {
  let component: ListCompleteLearnerComponent;
  let fixture: ComponentFixture<ListCompleteLearnerComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ListCompleteLearnerComponent]
    });
    fixture = TestBed.createComponent(ListCompleteLearnerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
