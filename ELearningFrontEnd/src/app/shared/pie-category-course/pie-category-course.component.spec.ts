import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PieCategoryCourseComponent } from './pie-category-course.component';

describe('PieCategoryCourseComponent', () => {
  let component: PieCategoryCourseComponent;
  let fixture: ComponentFixture<PieCategoryCourseComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PieCategoryCourseComponent]
    });
    fixture = TestBed.createComponent(PieCategoryCourseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
