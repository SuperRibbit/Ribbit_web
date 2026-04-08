import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListaAulas } from './lista-aulas';

describe('ListaAulas', () => {
  let component: ListaAulas;
  let fixture: ComponentFixture<ListaAulas>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListaAulas],
    }).compileComponents();

    fixture = TestBed.createComponent(ListaAulas);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
