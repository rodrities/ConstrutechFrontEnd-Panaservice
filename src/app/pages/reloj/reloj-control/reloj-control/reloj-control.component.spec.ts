import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RelojControlComponent } from './reloj-control.component';

describe('RelojControlComponent', () => {
  let component: RelojControlComponent;
  let fixture: ComponentFixture<RelojControlComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RelojControlComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RelojControlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
