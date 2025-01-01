import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InstructorChapterComponent } from './instructor-chapter.component';

describe('InstructorChapterComponent', () => {
  let component: InstructorChapterComponent;
  let fixture: ComponentFixture<InstructorChapterComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [InstructorChapterComponent]
    });
    fixture = TestBed.createComponent(InstructorChapterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
