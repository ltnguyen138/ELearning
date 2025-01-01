import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListLectureComponent } from './list-lecture.component';

describe('ListLectureComponent', () => {
  let component: ListLectureComponent;
  let fixture: ComponentFixture<ListLectureComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ListLectureComponent]
    });
    fixture = TestBed.createComponent(ListLectureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
