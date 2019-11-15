import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModifyProductPage } from './modify-product.page';

describe('ModifyProductPage', () => {
  let component: ModifyProductPage;
  let fixture: ComponentFixture<ModifyProductPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModifyProductPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModifyProductPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
