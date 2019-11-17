import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VerifyCredentialsPage } from './verify-credentials.page';

describe('VerifyCredentialsPage', () => {
  let component: VerifyCredentialsPage;
  let fixture: ComponentFixture<VerifyCredentialsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VerifyCredentialsPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VerifyCredentialsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
