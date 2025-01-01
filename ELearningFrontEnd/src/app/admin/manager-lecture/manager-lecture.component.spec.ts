import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManagerLectureComponent } from './manager-lecture.component';

describe('ManagerLectureComponent', () => {
  let component: ManagerLectureComponent;
  let fixture: ComponentFixture<ManagerLectureComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ManagerLectureComponent]
    });
    fixture = TestBed.createComponent(ManagerLectureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
