import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SharedChapterComponent } from './shared-chapter.component';

describe('SharedChapterComponent', () => {
  let component: SharedChapterComponent;
  let fixture: ComponentFixture<SharedChapterComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SharedChapterComponent]
    });
    fixture = TestBed.createComponent(SharedChapterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
