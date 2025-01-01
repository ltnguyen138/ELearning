import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PieStatisticTypeCategoryComponent } from './pie-statistic-type-category.component';

describe('PieStatisticTypeCategoryComponent', () => {
  let component: PieStatisticTypeCategoryComponent;
  let fixture: ComponentFixture<PieStatisticTypeCategoryComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PieStatisticTypeCategoryComponent]
    });
    fixture = TestBed.createComponent(PieStatisticTypeCategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
