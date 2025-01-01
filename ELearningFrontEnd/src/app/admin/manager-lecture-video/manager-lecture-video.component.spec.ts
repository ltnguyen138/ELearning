import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManagerLectureVideoComponent } from './manager-lecture-video.component';

describe('ManagerLectureVideoComponent', () => {
  let component: ManagerLectureVideoComponent;
  let fixture: ComponentFixture<ManagerLectureVideoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ManagerLectureVideoComponent]
    });
    fixture = TestBed.createComponent(ManagerLectureVideoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
