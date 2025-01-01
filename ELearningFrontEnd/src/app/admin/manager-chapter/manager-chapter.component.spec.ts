import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManagerChapterComponent } from './manager-chapter.component';

describe('ManagerChapterComponent', () => {
  let component: ManagerChapterComponent;
  let fixture: ComponentFixture<ManagerChapterComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ManagerChapterComponent]
    });
    fixture = TestBed.createComponent(ManagerChapterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
