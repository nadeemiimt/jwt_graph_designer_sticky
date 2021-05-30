import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DiagramDesignerComponent } from './diagram-designer.component';

describe('DiagramDesignerComponent', () => {
  let component: DiagramDesignerComponent;
  let fixture: ComponentFixture<DiagramDesignerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DiagramDesignerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DiagramDesignerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
