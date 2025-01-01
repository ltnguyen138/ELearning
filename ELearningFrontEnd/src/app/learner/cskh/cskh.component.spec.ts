import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CskhComponent } from './cskh.component';

describe('CskhComponent', () => {
  let component: CskhComponent;
  let fixture: ComponentFixture<CskhComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CskhComponent]
    });
    fixture = TestBed.createComponent(CskhComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
