import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AtraccionTalentoComponent } from './atraccion-talento.component';

describe('AtraccionTalentoComponent', () => {
  let component: AtraccionTalentoComponent;
  let fixture: ComponentFixture<AtraccionTalentoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AtraccionTalentoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AtraccionTalentoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
