import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DynamicCommonFormComponent } from './dynamic-form.component';

describe('DynamicFormComponent', () => {
  let component: DynamicCommonFormComponent;
  let fixture: ComponentFixture<DynamicCommonFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DynamicCommonFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DynamicCommonFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
