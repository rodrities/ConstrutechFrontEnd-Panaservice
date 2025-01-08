import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VerMarcacionesComponent } from './ver-marcaciones.component';

describe('VerMarcacionesComponent', () => {
  let component: VerMarcacionesComponent;
  let fixture: ComponentFixture<VerMarcacionesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VerMarcacionesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VerMarcacionesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
