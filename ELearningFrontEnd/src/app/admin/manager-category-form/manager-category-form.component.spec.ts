import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManagerCategoryFormComponent } from './manager-category-form.component';

describe('ManagerCategoryFormComponent', () => {
  let component: ManagerCategoryFormComponent;
  let fixture: ComponentFixture<ManagerCategoryFormComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ManagerCategoryFormComponent]
    });
    fixture = TestBed.createComponent(ManagerCategoryFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
